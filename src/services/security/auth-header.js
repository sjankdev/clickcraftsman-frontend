export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    const roles = user.roles || [];

    return {
      Authorization: "Bearer " + user.accessToken,
      roles: roles,
    };
  } else {
    return {};
  }
}
