import { ProfileHabitsForm} from "modules/Auth/components";
import { useDispatch } from 'react-redux'
import {useCallback, useEffect} from 'react'
import {addHabits, getCategories, getMe} from "../slices/auth";
import {useLazySelector} from "../../../hooks";


const ProfileHabitsContainer: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(()=> {
    dispatch(getMe())
  }, [])



  const { categories, habits} = useLazySelector(({ auth }) => {
    const { categories, habits } = auth
    return {
      categories,
      habits
    }
  })
  console.log("habits", habits?.result?.readingHabits)

  const handleSubmit = useCallback((values) => {
    dispatch(addHabits(values))
  }, [dispatch])

  useEffect(() => {
    dispatch(getCategories())
  }, []);

  return <ProfileHabitsForm
      onSubmit={handleSubmit}
      categoriesData={categories?.result?.data}
      habits={habits?.result?.readingHabits}
  />
}

export default ProfileHabitsContainer
