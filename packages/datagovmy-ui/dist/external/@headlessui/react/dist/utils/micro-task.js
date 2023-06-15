function o(t) {
  typeof queueMicrotask == "function"
    ? queueMicrotask(t)
    : Promise.resolve()
        .then(t)
        .catch(e =>
          setTimeout(() => {
            throw e;
          })
        );
}
export { o as microTask };
