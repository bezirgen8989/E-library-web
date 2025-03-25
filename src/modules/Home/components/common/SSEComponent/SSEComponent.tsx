import React, { useEffect, useState } from "react";
import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source"; // Импортируем необходимые типы
import { TokenManager } from "../../../../../utils";

interface SSEComponentProps {
  question: string; // Получаем вопрос как пропс
}

const SSEComponent: React.FC<SSEComponentProps> = ({ question }) => {
  const [messages, setMessages] = useState<string[]>([]);
  // const [meta, setMeta] = useState<object | null>(null);
  // const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    if (question) {
      const token = TokenManager.getAccessToken();

      // Отправляем POST запрос с вопросом и Bearer токеном через fetchEventSource
      const fetchData = async () => {
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

              // Обработка событий SSE
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
                return Promise.resolve(); // Возвращаем Promise
              },

              onerror(error: Event) {
                console.error("Ошибка SSE:", error);
              },

              // onMeta(event: EventSourceMessage) {
              //     try {
              //         const data = JSON.parse(event.data);
              //         setMeta(data); // Сохраняем метаданные
              //     } catch (error) {
              //         console.error("Ошибка обработки META события:", error);
              //     }
              // },

              // onDone(event: EventSourceMessage) {
              //     try {
              //         const data = JSON.parse(event.data);
              //         setDone(data.done === "done"); // Отмечаем завершение
              //     } catch (error) {
              //         console.error("Ошибка обработки DONE события:", error);
              //     }
              // },
            }
          );
        } catch (error) {
          console.error("Ошибка при отправке POST запроса:", error);
        }
      };

      fetchData();
    }
  }, [question]);

  return (
    <div>
      <div>
        <p style={{ color: "#fff" }}>{messages.join("")}</p>
      </div>
      {/*{meta && (*/}
      {/*    <div>*/}
      {/*        <strong>Метаданные:</strong>*/}
      {/*        <pre>{JSON.stringify(meta, null, 2)}</pre>*/}
      {/*    </div>*/}
      {/*)}*/}
      {/*{done && (*/}
      {/*    <div className={styles.messageSystem}>*/}
      {/*        <div className={styles.messageSystemContent} style={{ color: "green" }}>*/}
      {/*            Обработка завершена!*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*)}*/}
    </div>
  );
};

export default SSEComponent;
