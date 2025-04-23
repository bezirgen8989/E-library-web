type EventSourceActions = {
  event: "MESSAGE" | "META" | "DONE" | "AUDIO" | "ERROR" | string;
  data: string;
  onMessage: (data: { chunk: string }) => void;
  onDone: () => void;
  onMeta: (data: any) => void;
  onError?: (data: any) => void;
  onAudio?: (data: string) => void;
};

export const eventSourceMessageEventTypeActions = (
  params: EventSourceActions
) => {
  const { event, data, onMessage, onDone, onMeta, onError, onAudio } = params;

  try {
    const parsedData = JSON.parse(data);

    switch (event) {
      case "MESSAGE":
        onMessage(parsedData);
        break;
      case "META":
        onMeta(parsedData);
        break;
      case "DONE":
        onDone();
        break;
      case "AUDIO": {
        onAudio && onAudio(data);
        break;
      }
      case "ERROR": {
        onError && onError(parsedData);
        break;
      }
      default: {
        console.warn(`No handle for such event: ${event}`);
        break;
      }
    }
  } catch (err) {
    console.error(`Something went wrong: ${err}`);
  }
};
