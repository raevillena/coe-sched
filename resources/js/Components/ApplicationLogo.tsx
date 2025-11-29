import logo_light from "/Images/logo-white-2.png";
import logo_dark from "/Images/logo-black-2-.png";
import logo from "/Images/icpep.png";
import { Image } from "@heroui/image";

// export function ApplicationLogoLight() {
//     return (
//         <img
//             src={logo_light}
//             alt="Application Logo"
//             className="w-full h-full justify-center object-contain"
//         />
//     );
// }

// export function ApplicationLogoDark() {
//     return (
//         <img
//             src={logo_dark}
//             alt="Application Logo"
//             className="w-64 h-auto justify-center object-contain"
//         />
//     );
// }

//this is old
export function ApplicationLogo() {
    return (
        // <img
        //     src={logo}
        //     alt="Application Logo"
        //     className="w-64 h-auto justify-center object-contain"
        // />
        <Image
            isBlurred
            alt="Application Logo"
            className="m-2 w-64 h-auto justify-center object-contain"
            src={logo}
            //   width={240}
        />
    );
}
