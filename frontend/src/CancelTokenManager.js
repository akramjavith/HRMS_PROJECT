// // CancelTokenManager.js
// class CancelTokenManager {
//   constructor() {
//     this.cancelTokens = [];
//   }

//   addCancelToken(cancelToken) {
//     this.cancelTokens.push(cancelToken);
//   }

//   cancelAll() {
//     this.cancelTokens.forEach((cancel) => cancel());
//     this.cancelTokens = [];
//   }
// }

// const cancelTokenManager = new CancelTokenManager();
// export default cancelTokenManager;

// CancelTokenManager.js
class CancelTokenManager {
  constructor() {
    this.cancelTokens = [];
  }

  addCancelToken(cancel) {
    this.cancelTokens.push(cancel);
  }

  cancelAll() {
    console.log("[CancelTokenManager] Cancelling", this.cancelTokens.length, "requests");
    this.cancelTokens.forEach((cancel) => {
      try {
        cancel("Request cancelled due to route change");
      } catch (e) {
        console.warn("Cancel error:", e);
      }
    });
    this.cancelTokens = [];
  }
}

export default new CancelTokenManager();
