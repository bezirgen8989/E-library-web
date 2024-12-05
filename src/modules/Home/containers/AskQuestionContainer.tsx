import { AskQuestionComponent } from "../components";
import { useEffect, useState } from "react";
import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { useParams } from "react-router-dom";
import { getBookById } from "../slices/home";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";

const AskQuestionContainer: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBookById(id));
  }, []);

  const { currentBook } = useLazySelector(({ home }) => {
    const { currentBook } = home;
    return { currentBook };
  });

  console.log("currentBookQuestion", currentBook);

  useEffect(() => {
    if (question) {
      const token = sessionStorage.getItem("SESSION_TOKEN");

      const fetchData = async () => {
        setIsLoading(true); // Устанавливаем isLoading в true перед запросом
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
                indexName: "Seagull112233",
              }),

              onmessage(event: EventSourceMessage) {
                try {
                  const data = JSON.parse(event.data);
                  if (data.chunk) {
                    setMessages((prev) => [...prev, data.chunk]); // Добавляем новый фрагмент
                  }
                } catch (error) {
                  console.error("Ошибка обработки MESSAGE события:", error);
                }
              },

              onopen() {
                console.log("SSE соединение открыто");
                return Promise.resolve();
              },

              onerror(error: Event) {
                console.error("Ошибка SSE:", error);
              },
            }
          );
        } catch (error) {
          console.error("Ошибка при отправке POST запроса:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [question]);

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
    />
  );
};

export default AskQuestionContainer;
