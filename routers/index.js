import { Router } from "express";

const router = Router();
const USERNAME = process.env.USER_NAME || "cecilio";

const auth = (req, res, next) => {
  const { isAuth } = req.session;
  if (isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/", (req, res) => {
  console.log("ingreso login");
  res.redirect("login");
});

router.get("/login", (req, res) => {
  let data = req.signedCookies.data;
  if (data) {
    data = JSON.parse(data);
  }
  res.clearCookie("data").render("login", data);
});

router.post("/login", (req, res) => {
  const {
    body: { username },
  } = req;
  console.log("usuario:", username);
  if (username === USERNAME) {
    req.session.username = username;
    req.session.isAuth = true;
    res
      .cookie("data", JSON.stringify({ username: username }), {
        maxAge: 10000,
        signed: true,
      })
      .redirect("/private");
  } else {
    res
      .cookie(
        "data",
        JSON.stringify({
          mensaje: "Datos ingresados incorrectos...vuelva a intentarlo!!!",
          isError: true,
        }),
        { maxAge: 1000, signed: true }
      )
      .redirect("login");
    return;
  }
});

router.get("/private", auth, (req, res) => {
  const username = req.session.username;
  res.render("private", { username: username });
});

router.get("/logout", (req, res) => {
  const username = req.session.username;  
  req.session.destroy((error) => {
    if (error) {
      console.log("Ah ocurrido un error", error.message);
    }
    res
      .cookie(
        "data",
        JSON.stringify({ mensaje: `Hasta luego ${username}.`, isOk: true }),
        { maxAge: 2000, signed: true }
      )
      .redirect("/login");
  });
});

export default router;
