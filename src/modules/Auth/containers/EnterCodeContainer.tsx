import { useDispatch } from 'react-redux'
import {useCallback, useEffect} from 'react'
import { EnterCodeForm } from "../components";
import {emailConfirm, getMe} from "../slices/auth";
import {useLazySelector} from "../../../hooks";

const EnterCodeContainer: React.FC = () => {
  const dispatch = useDispatch();

    const { currentEmail } = useLazySelector(({ auth }) => {
        const { currentEmail } = auth;
        return {
            currentEmail
        };
    });

  const handleSubmit = useCallback(
      (values) => {
        console.log("code", values);
        dispatch(emailConfirm(values));
      },
      [dispatch]
  );
    useEffect(()=> {
        dispatch(getMe())
    }, [])

  return <EnterCodeForm onSubmit={handleSubmit} currentEmail={currentEmail} />;
};

export default EnterCodeContainer;
