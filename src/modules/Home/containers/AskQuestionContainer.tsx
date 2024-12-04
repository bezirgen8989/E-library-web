import { AskQuestionComponent } from "../components";
// import { useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { setUserQuestion } from "../slices/home";
import { useLazySelector } from "../../../hooks";

const AskQuestionContainer: React.FC = () => {
  // const dispatch = useDispatch();

  const { currentUserAnswer = {}, isLoading = false } = useLazySelector(
    ({ home }) => {
      console.log("Home State:", home);
      return {
        currentUserAnswer: home.currentUserAnswer || {},
        isLoading: home.currentUserAnswer?.isLoading || false,
      };
    }
  );

  console.log("currentUserAnswer", currentUserAnswer);
  console.log("isLoading", isLoading);

  // const handleSubmitQuestion = useCallback(
  //   (text) => {
  //     console.log("TEXT", text);
  //     dispatch(setUserQuestion({ query: text, indexName: "Seagull112233" }));
  //   },
  //   [dispatch]
  // );

  return (
    <AskQuestionComponent
    // onSubmitQuestion={handleSubmitQuestion}
    />
  );
};

export default AskQuestionContainer;
