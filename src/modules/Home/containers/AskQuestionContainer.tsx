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
  setAvatarStreamShow,
  setIsStreamShow,
  setStreamDone,
} from "../slices/home";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";
import { getLanguages, getMe, setAvatar } from "../../Auth/slices/auth";
import { useSocket } from "../../../hooks/useSocket";
import TokenManager from "../../../utils/TokenManager";

type Chat = {
  type: "user" | "response";
  message: string;
};

const AskQuestionContainer: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  console.log("messages", messages);
  const [meta, setMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  useEffect(() => {
    if (!id) return; // Если id нет — выходим
    dispatch(getBookById(id));
  }, [dispatch, id]);

  // useEffect(() => {
  //   dispatch(getMe());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch]);

  const {
    currentBook,
    avatars,
    avatarLanguage,
    avatarStreamShow,
    isStopQuestion,
  } = useLazySelector(({ home }) => {
    const {
      currentBook,
      avatars,
      avatarLanguage,
      avatarStreamShow,
      isStopQuestion,
    } = home;
    return {
      currentBook,
      avatars,
      avatarLanguage,
      avatarStreamShow,
      isStopQuestion,
    };
  });

  const { languages } = useLazySelector(({ auth }) => {
    const { languages } = auth;
    return { languages };
  });
  // console.log("languages", languages);

  useEffect(() => {
    setAvatarStreamShow(false);
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
          // id: avatarId,
          id: 3,
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
    if (!question || isStopQuestion) return;

    const token = TokenManager.getAccessToken();
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setMessages([]);

      try {
        const indexName = location.pathname.includes("ask_global_question")
          ? "GlobalLibraryCollection"
          : currentBook?.result?.vectorEntity?.indexName;

        setChatHistory((prev) => [
          ...prev,
          {
            type: "user",
            message: question,
            timestamp: new Date().toLocaleTimeString(),
          },
          {
            type: "response",
            message: "",
            timestamp: new Date().toLocaleTimeString(),
          },
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
            signal: controller.signal,

            onmessage(event: EventSourceMessage) {
              if (isStopQuestion) {
                controller.abort();
                return;
              }

              try {
                const data = JSON.parse(event.data);

                if (event.event === "MESSAGE" && data.chunk) {
                  console.log("data.chunk", data.chunk);
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
                console.error("Error processing MESSAGE or META event:", error);
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

    return () => {
      controller.abort();
    };
  }, [question, currentBook, isStopQuestion]);

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

  const { connected, subscribeToEvent, unsubscribeFromEvent } = useSocket({
    url: "https://elib.plavno.io:8080/srs",
    getAuthToken: async () => {
      const token = TokenManager.getAccessToken();
      return token ?? "";
    },
  });

  useEffect(() => {
    if (!connected) return;
    const handlePublishStream = () => {
      console.log("Stream started");
      dispatch(setAvatarStreamShow(true));
    };

    const handleUnpublishStream = () => {
      console.log("Stream ended");
      dispatch(setAvatarStreamShow(false));
      dispatch(setStreamDone(false));
    };

    subscribeToEvent("publish-stream", handlePublishStream);
    subscribeToEvent("unpublish-stream", handleUnpublishStream);

    return () => {
      unsubscribeFromEvent("publish-stream");
      unsubscribeFromEvent("unpublish-stream");
    };
  }, [subscribeToEvent, unsubscribeFromEvent, connected, avatarStreamShow]);

  // const filteredLanguages = languages?.result?.data.filter(lang => lang.name !== "Dari");

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
      languages={languages?.result?.data}
      indexName={currentBook?.result?.vectorEntity?.indexName}
    />
  );
};

export default AskQuestionContainer;
