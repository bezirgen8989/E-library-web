import { AskQuestionComponent } from "../components";
import { useEffect, useState } from "react";
import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { useParams, useHistory } from "react-router-dom";
import {
  clearBooks,
  getAvatars,
  getBookById,
  setIsStreamShow,
} from "../slices/home";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";
import { getLanguages, getMe, setAvatar } from "../../Auth/slices/auth";

type Chat = {
  type: "user" | "response";
  message: string;
};

const AskQuestionContainer: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [meta, setMeta] = useState<any>(null); // New state for metadata
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  useEffect(() => {
    dispatch(getBookById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch]);

  const { currentBook, avatars, avatarLanguage } = useLazySelector(
    ({ home }) => {
      const { currentBook, avatars, avatarLanguage } = home;
      return { currentBook, avatars, avatarLanguage };
    }
  );
  // console.log("avatarLanguage", avatarLanguage.id);

  const { languages } = useLazySelector(({ auth }) => {
    const { languages } = auth;
    return { languages };
  });
  // console.log("languages", languages);

  useEffect(() => {
    dispatch(clearBooks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getAvatars({
        limit: "12",
        page: "1",
      })
    );
  }, [dispatch]);

  const setUserAvatar = (avatarId: number) => {
    dispatch(
      setAvatar({
        avatarSettings: {
          id: avatarId,
        },
      })
    );
  };

  const extractMeta = (data: any[]): { meta: any; content: string }[] => {
    return data
      .map((item) => {
        if (item.docs && Array.isArray(item.docs)) {
          return item.docs.map((doc: any) => ({
            meta: doc.meta,
            content: doc.content,
          }));
        }
        return {
          meta: item.meta,
          content: item.content,
        };
      })
      .flat();
  };

  useEffect(() => {
    if (question) {
      const token = sessionStorage.getItem("SESSION_TOKEN");

      const fetchData = async () => {
        setIsLoading(true);
        setMessages([]);

        try {
          const indexName = location.pathname.includes("ask_global_question")
            ? "GlobalLibraryCollection"
            : currentBook?.result?.vectorEntity?.indexName;

          setChatHistory((prev) => [
            ...prev,
            { type: "user", message: question },
            { type: "response", message: "" },
          ]);

          await fetchEventSource(
            "https://elib.plavno.io:8080/api/v1/vectors/ask",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                query: question,
                indexName,
                language: { id: avatarLanguage?.id || 7 },
              }),

              onmessage(event: EventSourceMessage) {
                try {
                  const data = JSON.parse(event.data);

                  if (event.event === "MESSAGE" && data.chunk) {
                    setMessages((prev) => [...prev, data.chunk]);

                    setChatHistory((prev) => {
                      const updatedHistory = [...prev];
                      const lastIndex = updatedHistory.length - 1;

                      if (updatedHistory[lastIndex].type === "response") {
                        updatedHistory[lastIndex].message += data.chunk;
                      }

                      return updatedHistory;
                    });
                  }

                  if (event.event === "META") {
                    const extractedMeta = extractMeta(data);
                    setMeta(extractedMeta);
                  }
                } catch (error) {
                  console.error(
                    "Error processing MESSAGE or META event:",
                    error
                  );
                }
              },

              onopen() {
                console.log("SSE open channel");
                return Promise.resolve();
              },

              onerror(error: Event) {
                console.error("SSE error:", error);
              },
            }
          );
        } catch (error) {
          console.error("Error sending POST request:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [question, currentBook]);

  // Dispatch getMe() when leaving the "ask_question" route
  useEffect(() => {
    const unlisten = history.listen((location) => {
      if (!location.pathname.includes("ask_question")) {
        dispatch(getMe());
      }
    });

    return () => {
      unlisten();
      // Cleanup dispatch when component is unmounted
      dispatch(setIsStreamShow(false));
    };
  }, [dispatch, history]);

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <AskQuestionComponent
      clearMessages={clearMessages}
      setQuestion={setQuestion}
      messages={messages}
      isLoading={isLoading}
      title={currentBook?.result?.title}
      metaData={meta}
      avatars={avatars}
      setUserAvatar={setUserAvatar}
      chatHistory={chatHistory}
      languagesWithDari={languages?.result?.data}
      indexName={currentBook?.result?.vectorEntity?.indexName}
    />
  );
};

export default AskQuestionContainer;
