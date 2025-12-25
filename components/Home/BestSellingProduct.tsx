import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import bestSeller1 from "@/images/best-seller-1.png"
import bestSeller2 from "@/images/best-seller-2.png"
import bestSeller3 from "@/images/best-seller-3.png"
// container mx-auto max-w-screen-xl

export default function MeetBestSeeler() {
    return (
        <div className='py-10 lg:py-24'>
            <div className="container mx-auto">
                <div className="text-center py-6 lg:py-10">
                    <h1 className="md:text-4xl lg:text-5xl xl:text-6xl text-3xl font-semibold text-foreground">Meet Our Best Sellers</h1>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-7 lg:gap-16'>
                    <div className='lg:pl-32 pb-6 lg:pb-12'>
                        <div className='w-full md:max-w-[450px]'>
                            <Image
                                src={bestSeller1}
                                width={400}
                                height={350}
                                alt="best selling 1"
                                className='w-full h-auto object-contain'
                            />
                        </div>
                        
                    </div>
                    <div className='flex gap-16 lg:flex-row flex-col space-y-4'>
                        <div className='w-full md:max-w-[450px]'>
                            <Image
                                src={bestSeller2}
                                width={400}
                                height={350}
                                alt=""
                                className='w-full h-auto object-contain'
                            />
                        </div>
                        <div>
                            <h2 className='text-xl md:text-3xl lg:text-5xl font-normal text-[#101F2A] mb-8 leading-7 lg:leading-16 -mt-16'>
                                Belo.fur makes furniture with their best craftsman
                                offers <br /> his hand and make each product unique!
                            </h2>

                            {/* Call to Action Link */}
                            <a
                                href="/bestsellers"
                                className='flex items-center gap-2 text-base font-medium border-b border-black w-fit pb-1 hover:text-gray-600 transition-colors'
                            >
                                Shop Bestsellers
                                <ArrowRight className='w-4 h-4' />
                            </a>
                        </div>

                    </div>
                    <div className='md:flex justify-center lg:justify-end'>
                        <div className='w-full md:max-w-[370px] lg:-mt-52 mt-5'>
                            <Image
                                src={bestSeller3}
                                width={400}
                                height={350}
                                alt=""
                                className='w-full h-auto object-contain'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}