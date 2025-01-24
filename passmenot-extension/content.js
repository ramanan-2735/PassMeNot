chrome.storage.local.get(["credentials"], (result) => {
    if (result.credentials) {
      const { username, encryptedPassword } = result.credentials;
      
      document.querySelector("input[type='text'], input[type='email']").value = username;
      document.querySelector("input[type='password']").value = encryptedPassword;
      
      // Attempt to auto-submit login form
      const loginForm = document.querySelector("form");
      if (loginForm) {
        loginForm.submit();
      }
      
      chrome.storage.local.remove("credentials"); // Clear stored credentials after use
    }
  });
  