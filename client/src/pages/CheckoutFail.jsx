import { Link } from "react-router-dom";

const CheckoutFail = () =>
{
    return (
        <div className="bg-gray-100  h-[100%]">
            <div className="bg-white h-[400px] p-6 sm:mx-auto">
                <svg
                    viewBox="0 0 24 24"
                    className="text-green-600 w-16 h-16 mx-auto my-6"
                >
                    <path
                        fill="currentColor"
                        d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,0,0,1-1.43.188L5.764,
                            13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                    > </path>
                </svg>

                <div className="text-center">
                    <h3 className="sm:text-6xl text-2xl !my-8 text-gray-900 font-semibold text-center">
                        Payment Failed
                    </h3>
                    <p className="text-gray-600 my-2 sm:text-4xl text-2xl">
                        Please confirm that everything is correct and Try again!
                    </p>
                    <p className="text-3xl">Have a great day!</p>
                    <div className="py-10 text-center">
                        <Link
                            to="/Home"
                            className="px-12 bg-buttonBgColor text-white font-semibold py-3"
                        >
                            Go Back To Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutFail;