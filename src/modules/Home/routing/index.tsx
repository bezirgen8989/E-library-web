import { Suspense, lazy } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { Spinner } from "components/common";
import routes from "./routes";

export { routes };

export const Home = lazy(
  () => import(/* webpackChunkName: "Home" */ "modules/Home/pages/Home")
);
export const SearchBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "SearchBooks" */ "modules/Home/pages/SearchBooks"
    )
);
export const SearchTopBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "SearchTopBooks" */ "modules/Home/pages/SearchTopBooks"
    )
);
export const SearchNewBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "SearchNewBooks" */ "modules/Home/pages/SearchNewBooks"
    )
);
export const NewBooks = lazy(
  () => import(/* webpackChunkName: "NewBooks" */ "modules/Home/pages/NewBooks")
);
export const SuggestedBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "SuggestedBooks" */ "modules/Home/pages/SuggestedBooks"
    )
);
export const SimilarBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "SimilarBooks" */ "modules/Home/pages/SimilarBooks"
    )
);
export const StartedBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "StartedBooks" */ "modules/Home/pages/StartedBooks"
    )
);
export const NotStartedBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "NotStartedBooks" */ "modules/Home/pages/NotStartedBooks"
    )
);
export const FinishedBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "FinishedBooks" */ "modules/Home/pages/FinishedBooks"
    )
);
export const BooksShelf = lazy(
  () =>
    import(
      /* webpackChunkName: "BooksShelf " */ "modules/Home/pages/BooksShelfPage"
    )
);
export const Search = lazy(
  () => import(/* webpackChunkName: "Search" */ "modules/Home/pages/SearchPage")
);
export const AuthorBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "AuthorBooks" */ "modules/Home/pages/AuthorBooks"
    )
);
export const Book = lazy(
  () => import(/* webpackChunkName: "Reading" */ "modules/Home/pages/BookPage")
);
export const Reading = lazy(
  () =>
    import(/* webpackChunkName: "Reading" */ "modules/Home/pages/ReadingPage")
);
export const AskQuestion = lazy(
  () =>
    import(
      /* webpackChunkName: "AskQuestion" */ "modules/Home/pages/AskQuestionPage"
    )
);

const HomeRouting = () => (
  <Suspense fallback={<Spinner />}>
    <Switch>
      <Route exact path={routes.root} component={Home} />
      <Route exact path={routes.suggestedBooks} component={SuggestedBooks} />
      <Route exact path={routes.newBooks} component={NewBooks} />
      <Route exact path={routes.similarBooks} component={SimilarBooks} />
      <Route exact path={routes.startedBooks} component={StartedBooks} />
      <Route exact path={routes.notStartedBooks} component={NotStartedBooks} />
      <Route exact path={routes.finishedBooks} component={FinishedBooks} />
      <Route exact path={routes.booksShelf} component={BooksShelf} />
      <Route exact path={routes.search} component={Search} />
      <Route exact path={`${routes.searchBooks}/:id`} component={SearchBooks} />
      <Route exact path={routes.newBooks} component={NewBooks} />
      <Route exact path={`${routes.reading}/:id`} component={Reading} />
      <Route exact path={`${routes.book}/:id`} component={Book} />
      <Route exact path={`${routes.askQuestion}/:id`} component={AskQuestion} />
      <Route exact path={routes.askQuestionAll} component={AskQuestion} />
      <Route
        exact
        path={`${routes.searchTopBooks}/:id`}
        component={SearchTopBooks}
      />
      <Route
        exact
        path={`${routes.searchNewBooks}/:id`}
        component={SearchNewBooks}
      />
      <Route exact path={`${routes.authorBooks}/:id`} component={AuthorBooks} />
      <Redirect path="*" to={routes.root} />
    </Switch>
  </Suspense>
);

export default HomeRouting;
