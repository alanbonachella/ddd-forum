
import { Post } from "../../../domain/post";
import { Result } from "../../../../../shared/core/Result";
import { PostTitle } from "../../../domain/postTitle";
import { MemberId } from "../../../domain/memberId";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { PostText } from "../../../domain/postText";
import { PostSlug } from "../../../domain/postSlug";
import { Comment } from "../../../domain/comment";
import { CommentText } from "../../../domain/commentText";
import { CommentVote } from "../../../domain/commentVote";

let post: Post;
let postOrError: Result<Post>;
let postTitle: PostTitle;

let commentOne: Comment;

let memberIdOne: MemberId = MemberId
  .create(new UniqueEntityID('khalilstemmler'))
  .getValue();

let memberIdTwo: MemberId = MemberId
  .create(new UniqueEntityID('billybob'))
  .getValue();

beforeEach(() => {
  post = null;
  postOrError = null;
});

test('When we upvote a comment, the score of the post increases by one', () => {
  postTitle = PostTitle.create({ value: 'Cool first post!' }).getValue();
  
  postOrError = Post.create({ 
    title: postTitle,
    memberId: memberIdOne,
    type: 'text',
    text: PostText.create({ value: "Wow, this is a sick post!" }).getValue(),
    slug: PostSlug.create(postTitle).getValue()
  });

  expect(postOrError.isSuccess).toBe(true);
  post = postOrError.getValue();
  expect(post.points).toEqual(1);

  // Create a commennt
  commentOne = Comment.create({ 
    text: CommentText.create({ value: "yeah" }).getValue(),
    memberId: memberIdOne,
    postId: post.postId
  })
  .getValue();

  expect(commentOne.points).toEqual(1);

  // Add it to the post
  post.addComment(commentOne);
  expect(post.points).toEqual(1);

  // Someone else upvotes the comment
  commentOne.addVote(CommentVote.createUpvote(memberIdTwo, commentOne.commentId).getValue());
  expect(commentOne.points).toEqual(2);

  post.updateComment(commentOne);
  expect(post.points).toEqual(2);
  

})