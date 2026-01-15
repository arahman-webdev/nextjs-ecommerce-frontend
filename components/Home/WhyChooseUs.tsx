'use client'

import { Truck, ThumbsUp, RotateCcw, ShieldCheck } from 'lucide-react'

export default function WhyChooseUs() {
  return (
    <section className="container mx-auto px-4 py-20 text-center bg-white">
      {/* Top small text */}
      <p className="text-primary font-medium mb-4">
        There are some redeeming factors
      </p>

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        We Provide High Quality Goods
      </h2>

      {/* Description */}
      <p className="max-w-2xl mx-auto text-gray-600 mb-16">
        A client that’s unhappy for a reason is a problem, a client that’s unhappy
        though he or her can’t explain why is a bigger problem.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Fast Delivery */}
        <div className="flex flex-col items-center">
          <Truck className="h-12 w-12 text-primary mb-6" />
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Fast Delivery
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Chances are there wasn’t collaboration and checkpoints,
            there wasn’t a process.
          </p>
        </div>

        {/* Best Quality */}
        <div className="flex flex-col items-center">
          <ThumbsUp className="h-12 w-12 text-primary mb-6" />
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Best Quality
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            It’s content strategy gone awry right from the start.
            Forswearing the use of Lorem Ipsum.
          </p>
        </div>

        {/* Free Return */}
        <div className="flex flex-col items-center">
          <RotateCcw className="h-12 w-12 text-primary mb-6" />
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Free Return
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            True enough, but that’s not all that it takes to get things
            back on track out there for a text.
          </p>
        </div>

        {/* Extra Feature */}
        <div className="flex flex-col items-center">
          <ShieldCheck className="h-12 w-12 text-primary mb-6" />
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Secure Payment
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your payments are fully secured with industry-standard
            encryption and trusted gateways.
          </p>
        </div>
      </div>
    </section>
  )
}
