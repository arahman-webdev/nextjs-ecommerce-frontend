import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, Users, X, Edit, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface ReviewsTabProps {
  product: any;
  reviews: any[];
  user: any
}

export default function ReviewsTab({ product, reviews, user }: ReviewsTabProps) {
  const [reviewRating, setReviewRating] = useState(1);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [localReviews, setLocalReviews] = useState(reviews);
  const [submittingReview, setSubmittingReview] = useState(false);
  const router = useRouter()





  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };



  const handleSubmitReview = async () => {
    try {
      if (!reviewComment.trim()) {
        toast.error('Please write a review');
        return;
      }

      if (!product?.id) {
        toast.error('No product selected');
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login to submit a review');
        return router.push(`/login?redirect=/products/${product.slug}`);
      }

      setSubmittingReview(true);

      const reviewData = {
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/review/${product.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        }
      );

      /* ❗ fetch does NOT throw automatically */
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.clear();
          return;
        }

        throw new Error(data?.message || 'Failed to submit review');
      }

      const createdData = data?.data;

      if (createdData) {
        setLocalReviews((prev) => [createdData, ...prev])

        toast.success('Review submitted successfully!');
        setReviewComment('');
        setReviewRating(1);
        setShowReviewForm(false);
      }
    } catch (error: any) {
      console.error('Review submission error:', error);
      toast.error(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };


  // Edit review 

  const handleEditReview = async (reviewId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login");
        return;
      }

      setSubmittingReview(true);

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/review/${product.id}`,
        {
          rating: reviewRating,
          comment: reviewComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedReview = res.data.data;


      // AUTO REFRESH
      setLocalReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, ...updatedReview } : r
        )
      );

      toast.success("Review updated");
      setEditingReviewId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmittingReview(false);
    }
  };


  return (
    <div id='reviews' className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <div className="lg:w-1/3">
        <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-6 lg:p-8">
          <div className="text-center mb-6 lg:mb-8">
            <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{product.averageRating.toFixed(1)}</div>
            {renderRating(product.averageRating)}
            <p className="text-gray-600 mt-3 text-sm lg:text-base">
              Based on {localReviews.length} customer {localReviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <div className="space-y-3 lg:space-y-4" id='reviews'>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = localReviews.filter(r => Math.round(r.rating) === stars).length;
              const percentage = localReviews.length > 0 ? (count / localReviews.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-[60px] lg:min-w-[80px]">
                    <span className="text-sm text-gray-600">{stars}</span>
                    <Star className="h-3 w-3 lg:h-4 lg:w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: '#83B734'
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 min-w-[30px] lg:min-w-[40px]">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Writing review  */}


          <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
            <form>
              <DialogTrigger asChild>
                <Button onClick={() => setShowReviewForm(true)} className="w-full mt-6 lg:mt-8 h-10 lg:h-12 cursor-pointer bg-primary" >            <MessageSquare className="h-4 w-4 mr-2" />
                  Write a Review</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <div className="">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Write a Review</h4>

                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-2xl  focus:outline-none"
                        >
                          {star <= reviewRating ? <Star className='fill-yellow-400 text-yellow-400' /> : <Star />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <Textarea
                      placeholder="Share your experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button onClick={() => setShowReviewForm(false)} variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submittingReview || !reviewComment.trim()}
                    className="bg-primary hover:bg-primary/80 cursor-pointer"
                  >
                    {submittingReview ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>

      <div className="lg:w-2/3 mt-6 lg:mt-0">
        <div className="space-y-6 lg:space-y-8">
          {localReviews.length > 0 ? (
            localReviews.map((review) => (
              <div key={review.id} className="border-b pb-6 lg:pb-8 last:border-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#83B7341A' }}>
                      {
                        review?.user?.profilePhoto ? <>
                          <Image className='h-10 w-10 lg:h-12 lg:w-12 rounded-full' src={review.user.profilePhoto} width={40} height={40} alt='user photo' /></> : <Users className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#83B734' }} />
                      }
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900"><span className='text-gray-400'>By</span> {review.user.name}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
                        {renderRating(review.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.rating >= 4 && review?.user.id === user?.id && (
                    <button
                      onClick={() => {
                        setEditingReviewId(review.id);
                        setReviewRating(review.rating);
                        setReviewComment(review.comment);
                      }}
                      className="flex items-center gap-1 text-sm font-medium"
                      style={{ color: '#83B734' }}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  )}

                </div>



                {editingReviewId === review.id ? (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                        >
                          <Star
                            className={cn(
                              "h-5 w-5",
                              star <= reviewRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            )}
                          />
                        </button>
                      ))}
                    </div>

                    <Textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />

                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleEditReview(review.id)}
                        disabled={submittingReview}
                      >
                        Save
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingReviewId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{review.comment}</p>
                )}


                <div className=" gap-4 mt-4 lg:mt-6">
                  <p className='text-gray-600'>Was this review helpful to you?</p>
                  <div className='flex gap-2 py-2'>
                    <button className="text-sm text-gray-500 hover:text-gray-700 border p-2 flex justify-between gap-2 items-center">
                      <ThumbsUp /> <span>Helpful</span>
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700 border p-2 flex justify-between gap-2 items-center">
                      <ThumbsDown /> <span>Not Helpful</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 lg:py-16">
              <MessageSquare className="h-16 w-16 lg:h-20 lg:w-20 text-gray-300 mx-auto mb-4 lg:mb-6" />
              <h4 className="text-xl lg:text-2xl font-bold text-gray-700 mb-2 lg:mb-3">No Reviews Yet</h4>
              <p className="text-gray-600 max-w-md mx-auto mb-6 lg:mb-8 text-sm lg:text-base">
                Be the first to share your experience with this product. Your review helps others make informed decisions.
              </p>
              <Button
                className="px-6 lg:px-8 py-2 lg:py-3"
                style={{ backgroundColor: '#83B734' }}
                onClick={() => setShowReviewForm(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Write the First Review
              </Button>
            </div>
          )}
          {/* Review Form Modal */}





        </div>
      </div>
    </div>
  );
}