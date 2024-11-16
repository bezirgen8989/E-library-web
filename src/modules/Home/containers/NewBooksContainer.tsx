import {useCallback, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useLazySelector} from 'hooks'
import {getBookById, getNewBooks} from "../slices/home";
import NewBooksComponent from "../components/AllBooksComponents/NewBooksComponent";
import {routes} from "../routing";
import {useHistory} from "react-router-dom";

const NewBooksContainer: React.FC = () => {
    const dispatch = useDispatch()
    const history = useHistory();

    const {newBooks} = useLazySelector(({home}) => {

        const {newBooks} = home
        return {
            newBooks,
        }
    })

    const dateOrder = "[dateAdded]=desc"

    const getBook = useCallback((id) => {
        dispatch(getBookById(id.toString()))
        history.push(`${routes.book}/${id}`)
    }, [])

    useEffect(() => {
        dispatch(getNewBooks({
                limit: "20",
                page: "1",
                order: dateOrder,
                filter: null
            }
        ))

    }, []);

    return (
        <NewBooksComponent
            books={newBooks?.result?.data}
            getBook={getBook}
        />
    )
}

export default NewBooksContainer
