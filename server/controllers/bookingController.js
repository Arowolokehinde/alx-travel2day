import stripe from "stripe";
import dotenv from "dotenv";
import Tour from "../models/tourModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import catchAsync from "../utils/catchAsync.js";
import
{
  createOne,
  getOne,
  getAll,
  updateOne,
  deleteOne,
} from "../services/GenericService.js";

dotenv.config({ path: "./config/config.env" });

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchAsync(async (req, res, next) =>
{
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // console.log(tour);

  // 2) Create checkout session
  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    // success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${process.env.CLIENT_URL}/tours/${tour.id}`,
    // cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          unit_amount: tour.price * 100,
          currency: "usd",

          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${process.env.CLIENT_URL}/img/tours/${tour.imageCover}`,
            ],
            // images: [
            //   `${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover
            //   }`,
            // ],
          },
        },
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

const createBookingCheckout = async (session) =>
{
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;
  await Booking.create({ tour, user, price });
};

export function webhookCheckout(req, res, next)
{
  const signature = req.headers["stripe-signature"];

  let event;
  try
  {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err)
  {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
}

export const createBooking = createOne(Booking);
export const getBooking = getOne(Booking);
export const getAllBookings = getAll(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);
