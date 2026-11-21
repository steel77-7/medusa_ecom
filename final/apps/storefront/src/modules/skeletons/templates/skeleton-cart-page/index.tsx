import repeat from "@lib/util/repeat"

const SkeletonCartPage = () => {
  return (
    <div className="content-container py-8 sm:py-12 animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 bg-gray-200 rounded" />
        <div className="h-4 w-3 bg-gray-200 rounded" />
        <div className="h-4 w-10 bg-gray-200 rounded" />
      </div>

      <div className="h-10 w-48 bg-gray-200 rounded-lg mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-8 lg:gap-10 items-start">
        {/* Left Items Box */}
        <div className="border border-black/10 rounded-[20px] p-4 sm:p-6 bg-white divide-y divide-black/10">
          {repeat(3).map((index) => (
            <div key={index} className="flex gap-4 py-6 first:pt-0 last:pb-0">
              <div className="w-[100px] h-[100px] sm:w-[124px] sm:h-[124px] bg-[#F0EEED] rounded-[16px] shrink-0" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-4 w-1/4 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-7 w-20 bg-gray-200 rounded" />
                  <div className="h-10 w-28 bg-[#F0F0F0] rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Order Summary Box */}
        <div className="border border-black/10 rounded-[20px] p-6 sm:p-7 bg-white space-y-6">
          <div className="h-7 w-40 bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-5 w-20 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-24 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded" />
            </div>
            <div className="h-px bg-black/10 my-4" />
            <div className="flex justify-between">
              <div className="h-6 w-16 bg-gray-200 rounded" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-14 bg-black/10 rounded-full w-full" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCartPage
