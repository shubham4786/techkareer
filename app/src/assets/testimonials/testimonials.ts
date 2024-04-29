import test1 from './test1.jpeg'
import test2 from './test2.webp'
import test3 from './test3.jpeg'
import test4 from './test4.jpeg'
import test5 from './test5.jpeg'
import { StaticImageData } from 'next/image'
type testimonialsProp={
    image:StaticImageData,
    role:string,
    des:string

}
const testimonials:testimonialsProp[] = [
    {
        image:test1,
        role:"CEO at XYZ",
        des:"Stocked for this"
    },
    {
        image:test2,
        role:"Framer Expert",
        des:"This looks fun"
    },
    {
        image:test3,
        role:"CM at farmer",
        des:"So excited for this"
    },
    {
        image:test4,
        role:"Product desginer",
        des:"Cant wait for the battles"
    },
    {
        image:test5,
        role:"Manager",
        des:"Love to hire"
    }
]

export default testimonials