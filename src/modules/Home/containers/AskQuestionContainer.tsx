import { AskQuestionComponent } from "../components";
import { useEffect, useState } from "react";
import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { useParams, useHistory } from "react-router-dom";
import { clearBooks, getAvatars, getBookById } from "../slices/home";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";
import { getMe, setAvatar } from "../../Auth/slices/auth";

const AskQuestionContainer: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [meta, setMeta] = useState<any>(null); // New state for metadata
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getBookById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const { currentBook, avatars } = useLazySelector(({ home }) => {
    const { currentBook, avatars } = home;
    return { currentBook, avatars };
  });

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
    console.log("AVATARID", avatarId);
    dispatch(
      setAvatar({
        avatarSettings: {
          id: avatarId,
        },
      })
    );
  };

  useEffect(() => {
    if (question) {
      const token = sessionStorage.getItem("SESSION_TOKEN");

      const fetchData = async () => {
        setIsLoading(true);
        try {
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
                indexName: currentBook?.result?.vectorEntity?.indexName,
              }),

              onmessage(event: EventSourceMessage) {
                try {
                  const data = JSON.parse(event.data);

                  if (event.event === "MESSAGE" && data.chunk) {
                    setMessages((prev) => [...prev, data.chunk]);
                  }

                  if (event.event === "META") {
                    setMeta(data);
                  }
                } catch (error) {
                  console.error("Error processing MESSAGE event:", error);
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
    />
  );
};

export default AskQuestionContainer;
