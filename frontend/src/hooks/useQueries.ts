import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type User } from '../backend';
import { Principal } from '@dfinity/principal';

// ─── User Profile ───────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<User | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getUserProfile(
          (await actor.getCallerUserRole()) as unknown as Principal
        );
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<User | null>({
    queryKey: ['userProfile', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        return await actor.getUserProfile(userId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!userId,
    retry: false,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      username: string;
      email: string;
      displayName: string;
      courseTrack: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.registerUser(data.username, data.email, data.displayName, data.courseTrack);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export function useGetPostsForUser(userId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['postsForUser', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getPostsForUser(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createPost(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postsForUser'] });
    },
  });
}

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postsForUser'] });
    },
  });
}

// ─── Comments ────────────────────────────────────────────────────────────────

export function useGetCommentsForPost(postId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['commentsForPost', postId],
    queryFn: async () => {
      if (!actor || !postId) return [];
      return actor.getCommentsForPost(postId);
    },
    enabled: !!actor && !actorFetching && !!postId,
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addComment(postId, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['commentsForPost', variables.postId] });
    },
  });
}

// ─── Messages ────────────────────────────────────────────────────────────────

export function useGetMessagesWithUser(userId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['messagesWith', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getMessagesWithUser(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.sendMessage(receiverId, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messagesWith', variables.receiverId.toString()] });
    },
  });
}

// ─── Notifications ───────────────────────────────────────────────────────────

export function useGetNotifications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotificationsForUser();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
