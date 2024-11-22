import { HttpInterceptorFn } from "@angular/common/http";

/**
 * Intercept the request to add the authorization token to the header.
 * The token must be in the local storage.
 * @param req
 * @param next
 * @returns req with authorization header if a token exists.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
  let requestToSend = req;

  if (token) {
    const headers = req.headers.set("Authorization", "Bearer " + token);
    requestToSend = req.clone({
      headers: headers,
    });
  }

  return next(requestToSend);
};
