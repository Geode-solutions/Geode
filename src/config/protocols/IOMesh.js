export default function createMethods(session) {
  return {
    test: filename => {
      return session.call("opengeode.load.surface.triangulated2d", [filename]);
    }
  };
}
