/* eslint-disable arrow-body-style */
export default function createMethods(session) {
  return {
    menu: event => {
      return session.call("geode.mouse.menu", [event]);
    }
  };
}
