import { Suspense, lazy } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { Spinner } from "components/common";
import routes from "./routes";

export { routes };

export const Home = lazy(
  () => import(/* webpackChunkName: "SearchBooks" */ "modules/Home/pages/Home")
);
export const SearchBooks = lazy(
  () =>
    import(
      /* webpackChunkName: "SearchBooks" */ "modules/Home/pages/SearchBooks"
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
  () => import(/* webpackChunkName: "Book" */ "modules/Home/pages/BookPage")
);

const HomeRouting = () => (
  <Suspense fallback={<Spinner />}>
    <Switch>
      <Route exact path={routes.root} component={Home} />
      <Route exact path={routes.suggestedBooks} component={SuggestedBooks} />
      <Route exact path={routes.newBooks} component={NewBooks} />
      <Route exact path={routes.similarBooks} component={SimilarBooks} />
      <Route exact path={routes.search} component={Search} />
      <Route exact path={`${routes.searchBooks}/:id`} component={SearchBooks} />
      <Route exact path={`${routes.book}/:id`} component={Book} />
      <Route exact path={`${routes.authorBooks}/:id`} component={AuthorBooks} />
      <Redirect path="*" to={routes.root} />
    </Switch>
  </Suspense>
);

export default HomeRouting;
