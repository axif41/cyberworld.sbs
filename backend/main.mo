import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Random "mo:core/Random";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  public type UUID = Text;

  public type User = {
    id : Principal;
    username : Text;
    email : Text;
    displayName : Text;
    courseTrack : Text;
    profilePic : ?Storage.ExternalBlob;
  };

  public type Post = {
    id : UUID;
    authorId : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  module Post {
    public func compareByTimestamp(post1 : Post, post2 : Post) : Order.Order {
      if (post1.timestamp < post2.timestamp) {
        #less;
      } else if (post1.timestamp > post2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  public type Like = {
    postId : UUID;
    userId : Principal;
    timestamp : Time.Time;
  };

  public type Message = {
    id : UUID;
    senderId : Principal;
    receiverId : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  module Message {
    public func compareByTimestamp(message1 : Message, message2 : Message) : Order.Order {
      if (message1.timestamp < message2.timestamp) {
        #less;
      } else if (message1.timestamp > message2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  public type FriendRequest = {
    id : UUID;
    senderId : Principal;
    receiverId : Principal;
    status : { #pending; #accepted; #rejected };
  };

  public type Comment = {
    id : UUID;
    postId : UUID;
    authorId : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  module Comment {
    public func compareByTimestamp(comment1 : Comment, comment2 : Comment) : Order.Order {
      if (comment1.timestamp < comment2.timestamp) {
        #less;
      } else if (comment1.timestamp > comment2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  public type Notification = {
    id : UUID;
    userId : Principal;
    content : Text;
    timestamp : Time.Time;
    read : Bool;
  };

  public type MessageRole = {
    #user;
    #assistant;
  };

  public type ChatMessage = {
    role : MessageRole;
    content : Text;
    timestamp : Time.Time;
  };

  public type ChatSession = {
    sessionId : UUID;
    userId : Principal;
    title : Text;
    messages : [ChatMessage];
    createdAt : Time.Time;
    lastUpdated : Time.Time;
  };

  // AI Development Course Data
  public type CourseModule = {
    moduleId : Text;
    courseId : Text;
    title : Text;
    description : Text;
    slides : [Text];
  };

  public type Course = {
    id : Text;
    title : Text;
    description : Text;
    courseModules : [CourseModule];
    durationWeeks : Nat;
    difficulty : Text;
  };

  public type Certificate = {
    certificateId : Text;
    userId : Principal;
    courseId : Text;
    studentName : Text;
    issuedAt : Time.Time;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let users = Map.empty<Principal, User>();
  let posts = Map.empty<UUID, Post>();
  let likes = Map.empty<UUID, Like>();
  let messages = Map.empty<UUID, Message>();
  let friendRequests = Map.empty<UUID, FriendRequest>();
  let comments = Map.empty<UUID, Comment>();
  let notifications = Map.empty<UUID, Notification>();
  let savedChats = Map.empty<Principal, Map.Map<UUID, ChatSession>>();
  let certificates = Map.empty<Text, Certificate>();
  let aiDevelopmentCourseModules = Map.empty<Text, CourseModule>();

  // Helper function to generate unique IDs
  func generateId() : async UUID {
    let random = Random.crypto();
    let id = await* random.nat64();
    id.toText();
  };

  // ── Profile functions required by the frontend ──────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?User {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    users.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : User) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    // Ensure the stored profile always carries the real caller principal
    let sanitized = { profile with id = caller };
    users.add(caller, sanitized);
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async User {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  // ── User Management ──────────────────────────────────────────────────────────

  public shared ({ caller }) func registerUser(username : Text, email : Text, displayName : Text, courseTrack : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };
    let user : User = {
      id = caller;
      username;
      email;
      displayName;
      courseTrack;
      profilePic = null;
    };
    users.add(caller, user);
  };

  public shared ({ caller }) func updateProfilePic(profilePic : ?Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update their profile picture");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        let updatedUser = {
          user with
          profilePic;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  // ── Post Management ──────────────────────────────────────────────────────────

  public shared ({ caller }) func createPost(content : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (_) {
        let id = await generateId();
        let post : Post = {
          id;
          authorId = caller;
          content;
          timestamp = Time.now();
        };
        posts.add(id, post);
      };
    };
  };

  public query ({ caller }) func getPostsForUser(userId : Principal) : async [Post] {
    posts.values().toArray().filter(func(post) { post.authorId == userId }).sort(Post.compareByTimestamp);
  };

  public shared ({ caller }) func likePost(postId : UUID) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (_) {
        let id = await generateId();
        let like : Like = {
          postId;
          userId = caller;
          timestamp = Time.now();
        };
        likes.add(id, like);
      };
    };
  };

  // ── Messaging ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func sendMessage(receiverId : Principal, content : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let id = await generateId();
    let message : Message = {
      id;
      senderId = caller;
      receiverId;
      content;
      timestamp = Time.now();
    };
    messages.add(id, message);
  };

  public query ({ caller }) func getMessagesWithUser(userId : Principal) : async [Message] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can read messages");
    };
    messages.values().toArray().filter(
      func(message) {
        (message.senderId == caller and message.receiverId == userId) or (message.senderId == userId and message.receiverId == caller);
      }
    ).sort(Message.compareByTimestamp);
  };

  // ── Friend Requests ──────────────────────────────────────────────────────────

  public shared ({ caller }) func sendFriendRequest(receiverId : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send friend requests");
    };
    let id = await generateId();
    let request : FriendRequest = {
      id;
      senderId = caller;
      receiverId;
      status = #pending;
    };
    friendRequests.add(id, request);
  };

  public shared ({ caller }) func respondToFriendRequest(requestId : UUID, accepted : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can respond to friend requests");
    };
    switch (friendRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.receiverId != caller) {
          Runtime.trap("Not authorized to respond to this request");
        };
        let updatedRequest = {
          request with
          status = if accepted { #accepted } else {
            #rejected;
          };
        };
        friendRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getFriendRequestsForUser() : async [FriendRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view friend requests");
    };
    friendRequests.values().toArray().filter(func(request) { request.receiverId == caller });
  };

  // ── Comments ─────────────────────────────────────────────────────────────────

  public shared ({ caller }) func addComment(postId : UUID, content : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (_) {
        let id = await generateId();
        let comment : Comment = {
          id;
          postId;
          authorId = caller;
          content;
          timestamp = Time.now();
        };
        comments.add(id, comment);
      };
    };
  };

  public query ({ caller }) func getCommentsForPost(postId : UUID) : async [Comment] {
    comments.values().toArray().filter(func(comment) { comment.postId == postId }).sort(Comment.compareByTimestamp);
  };

  // ── Notifications ────────────────────────────────────────────────────────────

  public shared ({ caller }) func createNotification(userId : Principal, content : Text) : async () {
    // Only admins may create arbitrary notifications for other users
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create notifications");
    };
    let id = await generateId();
    let notification : Notification = {
      id;
      userId;
      content;
      timestamp = Time.now();
      read = false;
    };
    notifications.add(id, notification);
  };

  public query ({ caller }) func getNotificationsForUser() : async [Notification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their notifications");
    };
    notifications.values().toArray().filter(func(notification) { notification.userId == caller });
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : UUID) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };
    switch (notifications.get(notificationId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?notification) {
        if (notification.userId != caller) {
          Runtime.trap("Not authorized to mark this notification as read");
        };
        let updatedNotification = {
          notification with
          read = true;
        };
        notifications.add(notificationId, updatedNotification);
      };
    };
  };

  // ── Saved Chats Feature ──────────────────────────────────────────────────────

  public shared ({ caller }) func saveChatSession(title : Text, chatMessages : [ChatMessage]) : async UUID {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save chat sessions");
    };

    let sessionId = await generateId();
    let currentTime = Time.now();

    let chatSession : ChatSession = {
      sessionId;
      userId = caller;
      title;
      messages = chatMessages;
      createdAt = currentTime;
      lastUpdated = currentTime;
    };

    switch (savedChats.get(caller)) {
      case (null) {
        let userMap = Map.empty<UUID, ChatSession>();
        userMap.add(sessionId, chatSession);
        savedChats.add(caller, userMap);
      };
      case (?userMap) {
        userMap.add(sessionId, chatSession);
      };
    };

    sessionId;
  };

  public query ({ caller }) func getSavedChatsForCurrentUser() : async [ChatSession] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their saved chats");
    };
    switch (savedChats.get(caller)) {
      case (null) { [] };
      case (?userMap) { userMap.values().toArray() };
    };
  };

  public query ({ caller }) func getChatSession(sessionId : UUID) : async ChatSession {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view chat sessions");
    };
    switch (savedChats.get(caller)) {
      case (null) { Runtime.trap("No saved chats found for user") };
      case (?userMap) {
        switch (userMap.get(sessionId)) {
          case (null) { Runtime.trap("Chat session not found") };
          case (?chatSession) { chatSession };
        };
      };
    };
  };

  public shared ({ caller }) func deleteChatSession(sessionId : UUID) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete chat sessions");
    };
    switch (savedChats.get(caller)) {
      case (null) { Runtime.trap("No saved chats found for user") };
      case (?userMap) {
        if (userMap.containsKey(sessionId)) {
          userMap.remove(sessionId);
        } else {
          Runtime.trap("Chat session not found");
        };
      };
    };
  };

  // ── AI Development Course Management ────────────────────────────────────────

  public shared ({ caller }) func initializeAIDevelopmentCourse() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize courses");
    };

    let courseId = "ai-dev";

    let courseModules = [
      {
        moduleId = "ai-dev-1";
        courseId;
        title = "AI Programming with Python";
        description = "Deep dive into Python for AI development, including libraries and tools.";
        slides = [
          "Course Overview",
          "Python for AI",
          "NumPy & Pandas",
          "SciKit-Learn",
          "Google Colab Demo"
        ];
      },
      {
        moduleId = "ai-dev-2";
        courseId;
        title = "Machine Learning Fundamentals";
        description = "Core concepts of machine learning, types of learning, and key algorithms.";
        slides = [
          "Core Concepts",
          "Types of Learning",
          "Linear Regression",
          "Classification Algorithms",
          "Clustering"
        ];
      },
      {
        moduleId = "ai-dev-3";
        courseId;
        title = "Deep Learning and Neural Networks";
        description = "Fundamentals of deep learning with TensorFlow and PyTorch, including neural networks.";
        slides = [
          "Deep Learning Concepts",
          "TensorFlow & PyTorch",
          "Neural Networks",
          "Activation Functions",
          "Backpropagation"
        ];
      },
      {
        moduleId = "ai-dev-4";
        courseId;
        title = "Large Language Models & Prompt Engineering";
        description = "Mastering prompt engineering for LLMs and ethical considerations in AI.";
        slides = [
          "LLMs Overview",
          "Prompt Engineering",
          "Prompt Design Patterns",
          "Prompt Chaining",
          "Fine-Tuning"
        ];
      },
      {
        moduleId = "ai-dev-5";
        courseId;
        title = "Natural Language Processing with Transformers";
        description = "NLP using transformer models, speech recognition, and sentiment analysis.";
        slides = [
          "NLP Concepts",
          "Transformers",
          "Tokenization",
          "Speech Recognition",
          "Sentiment Analysis"
        ];
      },
      {
        moduleId = "ai-dev-6";
        courseId;
        title = "Applied AI: Computer Vision & Open Source Models";
        description = "Computer vision basics, image augmentation, and leveraging open source AI models.";
        slides = [
          "Computer Vision",
          "Image Augmentation",
          "Model Deployment",
          "Foundation Models",
          "Use Cases"
        ];
      },
    ];

    for (courseModule in courseModules.values()) {
      aiDevelopmentCourseModules.add(courseModule.moduleId, courseModule);
    };
  };

  public query ({ caller }) func getAIDevelopmentCourse() : async Course {
    let courseModules = aiDevelopmentCourseModules.values().toArray();

    let course : Course = {
      id = "ai-dev";
      title = "AI Development Course";
      description = "Master AI development from Python programming to advanced machine learning and deep learning with industry-standard tools.";
      courseModules;
      durationWeeks = 16;
      difficulty = "Advanced";
    };

    course;
  };

  public query ({ caller }) func getAIDevelopmentModules() : async [CourseModule] {
    aiDevelopmentCourseModules.values().toArray();
  };

  // ── Certificate Management ───────────────────────────────────────────────────

  public shared ({ caller }) func issueCertificate(userId : Principal, courseId : Text, studentName : Text) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can issue certificates");
    };

    let certificateId = await generateId();
    let certificate : Certificate = {
      certificateId;
      userId;
      courseId;
      studentName;
      issuedAt = Time.now();
    };

    certificates.add(certificateId, certificate);
    certificateId;
  };

  // Alias used by the admin panel
  public shared ({ caller }) func adminIssueCertificate(userId : Principal, courseId : Text, studentName : Text) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can issue certificates");
    };
    await issueCertificate(userId, courseId, studentName);
  };

  public query ({ caller }) func getCertificatesForUser(userId : Principal) : async [Certificate] {
    // A user may only fetch their own certificates; admins may fetch any
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own certificates");
    };
    certificates.values().toArray().filter(func(cert) { cert.userId == userId });
  };

  public query ({ caller }) func getAllCertificates() : async [Certificate] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access all certificates");
    };
    certificates.values().toArray();
  };

  // ── Admin Panel Functions ────────────────────────────────────────────────────

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access all users");
    };
    users.values().toArray();
  };

  public query ({ caller }) func getEnrollmentStats() : async {
    aiDev : Nat;
    webDev : Nat;
    dappDev : Nat;
    mobileDev : Nat;
    gameDev : Nat;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access enrollment stats");
    };

    var aiDev = 0;
    var webDev = 0;
    var dappDev = 0;
    var mobileDev = 0;
    var gameDev = 0;

    for (user in users.values()) {
      switch (user.courseTrack) {
        case ("ai-dev") { aiDev += 1 };
        case ("web-dev") { webDev += 1 };
        case ("dapp-dev") { dappDev += 1 };
        case ("mobile-dev") { mobileDev += 1 };
        case ("game-dev") { gameDev += 1 };
        case (_) {};
      };
    };

    { aiDev; webDev; dappDev; mobileDev; gameDev };
  };
};
