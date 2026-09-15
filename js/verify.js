const CLIENT_ID = "4esdr8enuf62oifdemp36b1fa6";
const REGION = "us-east-1";

const verifyForm = document.getElementById("verify-form");
const message = document.getElementById("verify-message");

verifyForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("verify-email").value.trim();
  const code = document.getElementById("verify-code").value.trim();

  message.textContent = "Verifying...";

  try {
    const response = await fetch(
      `https://cognito-idp.${REGION}.amazonaws.com/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target":
            "AWSCognitoIdentityProviderService.ConfirmSignUp"
        },

        body: JSON.stringify({
          ClientId: CLIENT_ID,
          Username: email,
          ConfirmationCode: code
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.__type ||
        "Verification failed."
      );
    }

    message.textContent =
      "認証が完了しました。ログインできます。";

    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1500);

  } catch (error) {
    console.error(error);
    message.textContent = error.message;
  }
});
