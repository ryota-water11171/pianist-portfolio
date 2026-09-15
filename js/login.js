const CLIENT_ID = "4esdr8enuf62oifdemp36b1fa6";
const REGION = "us-east-1";

const loginForm = document.getElementById("login-form");
const message = document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

message.textContent = "Logging in...";


  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "Logging in...";

  try {
    const response = await fetch(
      `https://cognito-idp.${REGION}.amazonaws.com/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target":
            "AWSCognitoIdentityProviderService.InitiateAuth"
        },
        body: JSON.stringify({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: CLIENT_ID,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.__type ||
        "Login failed."
      );
    }

    const auth = data.AuthenticationResult;

    sessionStorage.setItem("accessToken", auth.AccessToken);
    sessionStorage.setItem("idToken", auth.IdToken);
    sessionStorage.setItem(
      "refreshToken",
      auth.RefreshToken || ""
    );

    message.textContent = "Login successful.";

    setTimeout(() => {
      window.location.href = "/practice.html";
    }, 700);

  }

catch (error) {
  console.error(error);
  alert(error.message);
  message.textContent = error.message;
}




});
