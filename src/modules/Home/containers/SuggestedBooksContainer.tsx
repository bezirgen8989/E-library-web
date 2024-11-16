import {useCallback, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useLazySelector} from 'hooks'
import {getBookById, getTopBooks} from "../slices/home";
import SuggestedBooksComponent from "../components/AllBooksComponents/SuggestedBooksComponent";
import {routes} from "../routing";
import {useHistory} from "react-router-dom";

const SuggestedBooksContainer: React.FC = () => {
    const dispatch = useDispatch()
    const history = useHistory();

    const {suggestedBooks} = useLazySelector(({home}) => {
        const {suggestedBooks} = home
        return {
            suggestedBooks,
        }
    })

    // const topFilter = "[reviewCount][gte]=50"

    const getBook = useCallback((id) => {
        dispatch(getBookById(id.toString()))
        history.push(`${routes.book}/${id}`)
    }, [])

    useEffect(() => {
        dispatch(getTopBooks({
                limit:"20",
                page: "1",
                order: "",
                // filter: topFilter,
                filter: ""
            }
        ))

    }, []);

    return (
        <SuggestedBooksComponent
            books={suggestedBooks?.result?.data}
            getBook={getBook}
        />
    )
}

export default SuggestedBooksContainer
