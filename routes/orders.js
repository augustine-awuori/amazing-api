const express = require("express");
const router = express.Router();
const { isValidObjectId } = require("mongoose");

const { findUniqueUsername } = require("../utility/funcs");
const { User } = require("../models/user");
const { sendMail } = require("../services/mailing");
const { validateOrder, Order } = require("../models/order");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const mapBuyer = require("../middleware/mapBuyer");
const sendPushNotification = require("../utility/pushNotifications");
const service = require("../services/order");
const userService = require("../services/users");
const validate = require("../middleware/validate");

router.post("/sparkler", async (req, res) => {
  const { productId, name, email, profileImage, phoneNumber } = req.body;

  let user = User.findOne({ email });
  if (!user) {
    user = new User({
      email,
      name,
      username: findUniqueUsername(email),
      otherAccounts: { whatsapp: phoneNumber },
      avatar: profileImage,
    });
    await user.save();
  }

  const { shop, message } = req.body;
  const order = new Order({
    products: { [productId]: 1 },
    buyer: user._id.toString(),
    shop,
    message,
    status: "",
  });
  await order.save();

  res.send(await notifyOrderSubscribers(order));
});

router.post(
  "/",
  [auth, mapBuyer, validate(validateOrder)],
  async (req, res) => {
    const order = new Order(req.body);
    order.save();

    const admins = await User.find({ isAdmin: true });
    sendMail({
      message: "Someone just ordered",
      subject: "New Order",
      to: admins.map((a) => a.email),
    });
    const adminsTokens = admins
      .map((user) => user.expoPushToken)
      .filter((token) => typeof token === "string");
    adminsTokens.forEach((token) => {
      sendPushNotification(token, {
        message: `${order.message || "Admin, check this new order"}`,
        title: "New order",
      });
    });

    const populatedOrder = await service.findById(order._id);
    const sellerId = populatedOrder.shop?.author;
    if (sellerId) {
      const seller = await User.findById(sellerId);
      if (seller?.expoPushToken)
        sendPushNotification(seller.expoPushToken, {
          message: "Someone just ordered to your shop",
          title: "New order",
        });

      if (seller)
        sendMail({
          message: `Someone just ordered from your shop ${populatedOrder.shop?.name}`,
          subject: "New Order",
          to: seller.email,
        });
    }

    res.send(populatedOrder);
  }
);

router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id))
    return res.status(400).send({ error: "Invalid id" });

  const orders = (await userService.exists(id))
    ? await service.findMyOrders(id)
    : await service.findShopOrders(id);

  res.send(orders);
});

router.get("/single/:id", async (req, res) => {
  const order = await service.findById(req.params.id);

  if (!order)
    return res.status(404).send({ error: "This order doesn't exist" });

  res.send(order);
});

router.get("/", [auth, admin], async (_req, res) => {
  const orders = await service.find();

  res.send(orders);
});

router.patch("/:id", auth, async (req, res) => {
  const order = await service.findById(req.params.id);
  if (!order) return res.status(404).send({ error: "Order not found" });

  const userId = req.user._id.toString();
  const isAuthorised =
    req.user.isAdmin ||
    order.buyer._id.toString() === userId ||
    order.shop.author._id.toString() === userId;
  if (!isAuthorised)
    return res.status(403).send({ error: "Unauthorised access" });

  const updatedOrder = await service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.send(updatedOrder);
});

router.delete("/:orderId", [auth, admin], async (req, res) => {
  const order = await service.findByIdAndDelete(req.params.orderId);

  res.send(order);
});

async function notifyOrderSubscribers(order) {
  const admins = await User.find({ isAdmin: true });
  sendMail({
    message: "Someone just ordered",
    subject: "New Order",
    to: admins.map((a) => a.email),
  });
  const adminsTokens = admins
    .map((user) => user.expoPushToken)
    .filter((token) => typeof token === "string");
  adminsTokens.forEach((token) => {
    sendPushNotification(token, {
      message: `${order.message || "Admin, check this new order"}`,
      title: "New order",
    });
  });

  const populatedOrder = await service.findById(order._id);
  const sellerId = populatedOrder.shop?.author;
  if (sellerId) {
    const seller = await User.findById(sellerId);
    if (seller?.expoPushToken)
      sendPushNotification(seller.expoPushToken, {
        message: "Someone just ordered to your shop",
        title: "New order",
      });

    if (seller)
      sendMail({
        message: `Someone just ordered from your shop ${populatedOrder.shop?.name}`,
        subject: "New Order",
        to: seller.email,
      });
  }

  return populatedOrder;
}

module.exports = router;
