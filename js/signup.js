
const CLIENT_ID = "4esdr8enuf62oifdemp36b1fa6";
const REGION = "us-east-1";

const signupForm = document.getElementById("signup-form");
const message = document.getElementById("signup-message");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  message.textContent = "Creating account...";

  try {
    const response = await fetch(
      `https://cognito-idp.${REGION}.amazonaws.com/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target":
            "AWSCognitoIdentityProviderService.SignUp"
        },

        body: JSON.stringify({
          ClientId: CLIENT_ID,
          Username: email,
          Password: password,

          UserAttributes: [
            {
              Name: "email",
              Value: email
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.__type ||
        "Account creation failed."
      );
    }

    message.textContent =
      "確認コードをメールに送りました。";
setTimeout(() => {
  window.location.href = "/verify.html";
}, 1500);
    console.log("Cognito signup success:", data);

  } catch (error) {
    console.error(error);

    message.textContent = error.message;
  }
});
