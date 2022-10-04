export function getPreviousRouteFromState(state: { [key: string]: any }): any {
  let checkRoute = null;
  if (state && state.index > -1 && state.routes) {
    checkRoute = state.routes[state.index];
    if (checkRoute.state && checkRoute.state.routes) {
      return getPreviousRouteFromState(checkRoute);
    }
    const previousRouteIndex = state.index - 1;
    if (previousRouteIndex > -1) {
      checkRoute = state.routes[previousRouteIndex];
    }
  }
  return checkRoute;
}
