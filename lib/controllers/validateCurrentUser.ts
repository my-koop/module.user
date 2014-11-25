function validateCurrentUser(req, callback) {
  callback(
    (
      !req.session.user ||
      req.session.user.id !== parseInt(req.param("id"))
    ) &&
    new Error("Not current user.")
  );
}

export = validateCurrentUser;
