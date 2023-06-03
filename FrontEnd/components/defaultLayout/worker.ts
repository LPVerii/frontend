export default onmessage = (e) => {
    postMessage(`Hello, ${e.data}!`);
  };
  