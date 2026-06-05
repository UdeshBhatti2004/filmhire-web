import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import MessagingView from "../../components/professional/MessagingView";
import ProfileView from "../../components/professional/ProfileView";
import HomeView from "../../components/professional/HomeView";
import UploadPortfolioModal from "../../components/professional/UploadPortfolioModal";
import JobsView from "../../components/professional/JobsView";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import HomeSkeleton from "../../components/loaders/HomeSkeletonProfessional";
import ProfessionalWorkspaceView from "../../components/professional/ProfessionalWorkspaceView";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();

  const [isPosting, setIsPosting] = useState(false);

  const [expandedComments, setExpandedComments] = useState({});
  const [homePosts, setHomePosts] = useState([]);
  const [newPostTools, setNewPostTools] = useState("");
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioCategory, setPortfolioCategory] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [feedJobs, setFeedJobs] = useState([]);
  const [applicationStatuses, setApplicationStatuses] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const [currentTab, setCurrentTab] = useState("home");
  const [jobsSubTab, setJobsSubTab] = useState("explore");
  const [selectedJobView, setSelectedJobView] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [profile, setProfile] = useState(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaType, setNewMediaType] = useState("image");
  const [newMediaTech, setNewMediaTech] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchFeedJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select(
        `
        *,
        client:profiles!jobs_client_id_fkey(
          id,
          full_name,
          avatar_url,
          company_name
        )
      `,
      )
      .eq("status", "open")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }

    setFeedJobs(data || []);
  };

  const fetchComments = async (postId) => {
    const { data, error } = await supabase
      .from("professional_post_comments")
      .select(
        `
      *,
      profile:profiles(
        id,
        full_name,
        avatar_url
      )
    `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setComments((prev) => ({
      ...prev,
      [postId]: data || [],
    }));
  };

  const handleAddComment = async (postId) => {
    try {
      const text = commentInputs[postId]?.trim();

      if (!text) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("professional_post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          comment: text,
        });

      if (error) throw error;

      const post = homePosts.find((p) => p.id === postId);

      await supabase
        .from("professional_posts")
        .update({
          comments_count: (post.comments_count || 0) + 1,
        })
        .eq("id", postId);

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));

      setHomePosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments_count: (p.comments_count || 0) + 1,
              }
            : p,
        ),
      );

      fetchComments(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("job_applications")
        .select("job_id, status")
        .eq("professional_id", user.id);

      if (error) throw error;

      const statusMap = {};
      const appliedIds = [];

      if (data) {
        data.forEach((item) => {
          statusMap[item.job_id] = item.status || "pending";
          appliedIds.push(item.job_id);
        });
      }

      setApplicationStatuses(statusMap);
      setAppliedJobIds(appliedIds);
    } catch (err) {
      console.error("Applied jobs error tracking trace:", err);
    }
  };

  const [activeJobChatTarget, setActiveJobChatTarget] = useState(null);

  const [newPostText, setNewPostText] = useState("");
  const [postMedia, setPostMedia] = useState(null);

  const handlePostMediaChange = (e) => {
    if (e.target.files && e.target.files?.[0]) {
      setPostMedia(e.target.files[0]);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const post = homePosts.find((p) => p.id === postId);

      if (!post) return;

      // Unlike
      if (post.hasLiked) {
        const { error: deleteError } = await supabase
          .from("professional_post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;

        const { error: updateError } = await supabase
          .from("professional_posts")
          .update({
            likes_count: Math.max((post.likes_count || 0) - 1, 0),
          })
          .eq("id", postId);

        if (updateError) throw updateError;

        setHomePosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  hasLiked: false,
                  likes_count: Math.max((p.likes_count || 0) - 1, 0),
                }
              : p,
          ),
        );
      }

      // Like
      else {
        const { error: insertError } = await supabase
          .from("professional_post_likes")
          .insert({
            post_id: postId,
            user_id: user.id,
          });

        if (insertError) throw insertError;

        const { error: updateError } = await supabase
          .from("professional_posts")
          .update({
            likes_count: (post.likes_count || 0) + 1,
          })
          .eq("id", postId);

        if (updateError) throw updateError;

        setHomePosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  hasLiked: true,
                  likes_count: (p.likes_count || 0) + 1,
                }
              : p,
          ),
        );
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleCreateHomePost = async () => {
    setIsPosting(true);
    if (!newPostText.trim()) return;

    try {
      let mediaUrl = null;

      if (postMedia) {
        const fileExt = postMedia.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post-media")
          .upload(filePath, postMedia);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("post-media").getPublicUrl(filePath);

        mediaUrl = publicUrl;
      }

      const toolsArray = (newPostTools || "")
        .split(",")
        .map((tool) => tool.trim())
        .filter(Boolean);

      const { error } = await supabase.from("professional_posts").insert({
        professional_id: profile.id,
        content: newPostText,
        media_url: mediaUrl,
        tools: toolsArray,
      });

      if (error) throw error;

      setNewPostText("");
      setNewPostTools("");
      setPostMedia(null);

      fetchPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files?.[0] || null);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files?.[0] || null);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files?.[0];
      setSelectedFile(file);
      if (file.type.startsWith("video/")) setNewMediaType("video");
      else if (file.type.startsWith("image/")) setNewMediaType("image");
    }
  };

  const handleCreateMediaItem = async () => {
    try {
      if (
        !portfolioTitle.trim() ||
        !portfolioCategory.trim() ||
        !thumbnailFile ||
        !videoFile
      ) {
        return;
      }

      setIsUploading(true);
      const thumbnailExt = thumbnailFile.name.split(".").pop();

      const thumbnailPath = `${profile.id}/${Date.now()}-thumbnail.${thumbnailExt}`;

      const { error: thumbnailError } = await supabase.storage
        .from("portfolio-thumbnails")
        .upload(thumbnailPath, thumbnailFile);

      if (thumbnailError) throw thumbnailError;

      const {
        data: { publicUrl: thumbnailUrl },
      } = supabase.storage
        .from("portfolio-thumbnails")
        .getPublicUrl(thumbnailPath);

      const videoExt = videoFile.name.split(".").pop();

      const videoPath = `${profile.id}/${Date.now()}-video.${videoExt}`;

      const { error: videoError } = await supabase.storage
        .from("portfolio-videos")
        .upload(videoPath, videoFile);

      if (videoError) throw videoError;

      const {
        data: { publicUrl: videoUrl },
      } = supabase.storage.from("portfolio-videos").getPublicUrl(videoPath);

      const { error: insertError } = await supabase
        .from("portfolio_items")
        .insert({
          professional_id: profile.id,
          title: portfolioTitle,
          thumbnail_url: thumbnailUrl,
          video_url: videoUrl,
          category: portfolioCategory,
        });

      if (insertError) throw insertError;
      window.dispatchEvent(new Event("portfolio-updated"));

      setPortfolioTitle("");
      setPortfolioCategory("");

      setThumbnailFile(null);
      setVideoFile(null);

      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSaveJob = (jobId, e) => {
    e.stopPropagation();
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    } else {
      setSavedJobIds((prev) => [...prev, jobId]);
    }
  };

  const refreshApplications = async () => {
    await fetchAppliedJobs();
    await fetchAppliedJobsData();
  };

  const getFilteredJobs = () => {
    let list = feedJobs;

    if (jobsSubTab === "saved") {
      list = feedJobs.filter((j) => savedJobIds.includes(j.id));
    } else if (jobsSubTab === "applied") {
      list = appliedJobs;
    }

    return list.filter(
      (j) =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.client?.company_name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  };

  const fetchAppliedJobsData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("job_applications")
        .select(
          `
        status,
        jobs (
          *,
          client:profiles!jobs_client_id_fkey(
            id,
            full_name,
            avatar_url,
            company_name
          )
        )
      `,
        )
        .eq("professional_id", user.id);

      if (error) throw error;

      const jobs =
        data?.map((item) => ({
          ...item.jobs,
          applicationStatus: item.status,
        })) || [];

      setAppliedJobs(jobs);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;

    const { data, error } = await supabase
      .from("professional_posts")
      .select(
        `
      *,
      professional:profiles(
        id,
        full_name,
        avatar_url,
        specializations
      ),
      professional_post_likes(
        user_id
      )
    `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const postsWithLikes = (data || []).map((post) => ({
      ...post,
      hasLiked: post.professional_post_likes?.some(
        (like) => like.user_id === userId,
      ),
    }));

    setHomePosts(postsWithLikes);
  };

  const currentFilteredJobs = getFilteredJobs();

  useEffect(() => {
    const channel = supabase
      .channel("professional-posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "professional_posts",
        },
        (payload) => {
          console.log("REALTIME PAYLOAD:", payload);

          const updatedPost = payload.new;
          if (payload.eventType === "INSERT") {
            fetchPosts();
            return;
          }

          if (!updatedPost) return;

          setHomePosts((prev) =>
            prev.map((post) =>
              post.id === updatedPost.id
                ? {
                    ...post,
                    likes_count: updatedPost.likes_count,
                    comments_count: updatedPost.comments_count,
                  }
                : post,
            ),
          );
        },
      )
      .subscribe((status) => {
        console.log("REALTIME STATUS:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("professional-comments")

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "professional_post_comments",
        },
        async (payload) => {
          console.log("NEW COMMENT", payload);

          const comment = payload.new;

          // Only update if comments for this post are currently open
          if (!expandedComments[comment.post_id]) return;

          await fetchComments(comment.post_id);
        },
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [expandedComments]);

  useEffect(() => {
    fetchFeedJobs();
    fetchPosts();
    fetchAppliedJobs();
    fetchAppliedJobsData();
  }, []);

  if (!profile) {
    return <HomeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#09090d] text-[#e2e2e9] antialiased flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #09090d; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <ProfessionalNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      <div className="w-full max-w-full mx-auto px-4 lg:px-6 pt-5 flex-1">
        {currentTab === "home" && (
          <HomeView
            profile={profile}
            feedJobs={feedJobs}
            homePosts={homePosts}
            newPostText={newPostText}
            setNewPostText={setNewPostText}
            newPostTools={newPostTools}
            setNewPostTools={setNewPostTools}
            handleCreateHomePost={handleCreateHomePost}
            handleLikePost={handleLikePost}
            postMedia={postMedia}
            handlePostMediaChange={handlePostMediaChange}
            expandedComments={expandedComments}
            setExpandedComments={setExpandedComments}
            comments={comments}
            setComments={setComments}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
            fetchComments={fetchComments}
            handleAddComment={handleAddComment}
            isPosting={isPosting}
          />
        )}

        {currentTab === "jobs" && (
          <JobsView
            jobsFeed={feedJobs}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            jobsSubTab={jobsSubTab}
            setJobsSubTab={setJobsSubTab}
            selectedJobView={selectedJobView}
            setSelectedJobView={setSelectedJobView}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
            applicationStatuses={applicationStatuses}
            toggleSaveJob={toggleSaveJob}
            handleApplyJob={refreshApplications}
            currentFilteredJobs={currentFilteredJobs}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === "workspaces" && <ProfessionalWorkspaceView />}

        {currentTab === "profile" && (
          <ProfileView
            profile={profile}
            setShowUploadModal={setShowUploadModal}
            setCurrentTab={setCurrentTab}
            navigate={navigate}
          />
        )}
      </div>

      <UploadPortfolioModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        title={portfolioTitle}
        setTitle={setPortfolioTitle}
        category={portfolioCategory}
        setCategory={setPortfolioCategory}
        thumbnailFile={thumbnailFile}
        videoFile={videoFile}
        handleThumbnailChange={handleThumbnailChange}
        handleVideoChange={handleVideoChange}
        handleCreateMediaItem={handleCreateMediaItem}
        isUploading={isUploading}
      />
    </div>
  );
};

export default ProfessionalDashboard;
