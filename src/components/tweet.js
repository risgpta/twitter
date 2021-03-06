import React,{useEffect,useState,useRef} from 'react';

import like from '../assets/heart.svg'; 
import profile from '../assets/person.svg'; 
import unlike from '../assets/unlikeheart.svg'
import cmnt from '../assets/comment.svg'

import { connect } from 'react-redux';
import {deleteTweet,updateTweet} from '../actions/tweetAction';
import {likeTweet,fetchLikeList} from '../actions/likeAction';

import '../App.css';
import { readComment } from '../actions/commentAction';
import Comments from './comment';

const Tweet = (props) => {
    
    

    const inputRef = useRef(null);

    const [deleteTweetid,setDeleteTweetid] = useState(null);

    const [data,setData] = useState(null);
    const [editTweetid,setEditTweetid] = useState(null);
    const [edit,setEdit] = useState(false);

    const [showComment,setShowComment] = useState(false);

    const [imgV,setImgV] = useState(0);

    const [showopt,setshowopt] = useState(false);

    const [comments,setComments] = useState(null);

    const [users,setUsers] = useState(null);


    function deletePost(id){
        setDeleteTweetid(id);
    }

    function editPost(id)
    {
        setEditTweetid(id);
    }

    function likePost(id)
    {
        let putdata = {
            id:id,
            body : JSON.stringify({
                flag: props.like_flag ? -1 : 1,
                _id : id,
            }),
        }
        props.likeTweet(putdata);
    }

    const getComment = (id) => {
        setShowComment(true);
        //console.log(id);
        props.readComment(id);
        //props.commentTweet(id); ... need to build it....
    }

    useEffect(()=> {
        //console.log(props.Comments);
        if(props.Comments && props.Comments.commentDoc && props.Comments.userDoc)
        {
            let comment_types = new Map();
            let user_ids = new Map();
            for(let item of props.Comments.commentDoc)
            {
                if(item._id === null)
                {
                    comment_types['main']  = item.comments;
                } 
                else
                {
                    comment_types[item._id ]  = item.comments;
                }
            }
            setComments(comment_types);
            for(let item of props.Comments.userDoc)
            {
                user_ids[item._id ]  = item;
            }
            setUsers(user_ids);
            //console.log(comment_types);
            //console.log(user_ids);
        }
    },[props.Comments,props.DoneComments]);

    useEffect(()=>{
        setData({
            message : props.content,
        })
    },[]);

    const change = (key,value) => {
        setData({
            ...data,
            [key] : value,
        })
    }

    useEffect(()=>{
        if(edit === true)
        {
            inputRef.current.focus();
        }
    },[edit]);
    
    useEffect(() => {
        if(deleteTweetid !== null)
        {
            let data = {
                token : localStorage.getItem('twitter-token'),
                tweet_id:deleteTweetid,
            }
            props.deleteTweet(data);   
            setDeleteTweetid(null);
        }
    },[deleteTweetid]);

    useEffect(() => {

    },[data]);

    useEffect(() => {
        if(editTweetid !== null)
        {
            let putdata = {
                token : localStorage.getItem('twitter-token'),
                tweet_id:editTweetid,
                body : JSON.stringify(data),
            }
            props.updateTweet(putdata);   
            setEditTweetid(null);
            setEdit(false);
        }
    },[editTweetid]);

    useEffect(() => {
        if(props.Likelist === null && localStorage.getItem('username'))
        {
            let data = {
                tweet_id:props.id,
            }
            props.fetchLikeList(data);
        }
    },[props.Likelist])

    useEffect(() => {
        //props.readComment(props.id);
        console.log(props.update);
        console.log('working...');
    }, [props.update]);

    let time = props.upd || '';   
    let date = time.split('T');
    const Update_date = new Date(date[0]);
    let Update_time = new Date(time);

    let image_item = [];

    const time_show = [];

    if(props.upd)
    {
        //console.log(Update_time.toLocaleTimeString());
        //console.log(Update_date.toLocaleDateString('en-US'));
        
        let post_day = new Date(Update_date.toLocaleDateString('en-US')+' '+Update_time.toLocaleTimeString());
        //console.log(post_day);

        let today = new Date();

        let distance = today.getTime() - post_day.getTime();

        //console.log(distance);

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if(days > 0)
        {
            if(days > 365)
            time_show.push(`About ${parseInt(days/365)} year ago`);
            else if(days > 30)
            time_show.push(`About ${parseInt(days/30)} month ago`);
            else
            time_show.push(`${days} days ago`);
        }
        else if(hours > 0)
        {
            time_show.push(`${hours}h ago`)
        }
        else if(minutes > 0)
        {
            time_show.push(`${minutes}m ago`)
        }
        else
        {
            time_show.push(`a few seconds ago`)
        }
        
    }

    if(props.img && props.img.length)
    {
        for(let i=0; i<props.img.length; i++)
        {
            image_item.push(
                imgV === i ?
                <img  src={props.img[i]} alt="image" className="tweetPostImage"/> 
                :
                ''
            );
        }
    }

    let vid_item = [];

    if(props.vid)
    {
        vid_item.push(<video className="videoDiv"controls>
        <source src={props.vid} />
        </video>)
    }

    const Options = () => {
        return (
            <div>
                <div className="dropdown">
                <button onClick={() => setshowopt(!showopt)} className="dropbtn">...</button>
                <div className="dropdown-content">
                {
                    showopt === true ?
                    <div>
                    {
                        localStorage.getItem('userid') === props.userid? 
                        <span><div onClick={() => deletePost(props.id)} className="deletebtn">delete</div> <div onClick={edit === true ? () => editPost(props.id) : () => {setEdit(true)}} className="deletebtn">{edit === true ? 'save' : 'edit'}</div></span> 
                        : 
                        <div className="deletebtn">report</div>
                    }
                    </div>
                    :
                    ''
                }
                </div>
                </div>
            </div>
        )
    }

    return (
        <div className="tweet">
          <div className="aboveTweet">
            <div className="user" ><img  src={props.pimg === null ? profile : props.pimg} alt="profile" className="usertweetpic" />{props.user}</div>
            <div className="tweetTime">{time_show}</div>
            <Options/>
            </div>
            <div className="mainTweet">
            {
                edit === true ?
                <input ref={inputRef} onChange={(e) => change("message",e.target.value)} className="mainTweet editTweetcontent" value={data.message}/>
                :
                <div className="tweetContent">{props.content}</div>
            }
            {
                image_item.length > 1?
                <span className="imgtag">{imgV+1}/{image_item.length}</span>
                :
                ''
            
            }
            {
                image_item
            }
            {
                image_item.length > 1 ?
                <span className="slideImage">
                {
                    imgV === 1 || imgV === 2 ?
                    <a onClick={() => setImgV(imgV-1)} class="prev" >&#10094;</a>
                    :
                    ''
                }
                {
                    imgV === 0 || imgV === 1 && image_item.length > 2 ?
                    <a onClick={() => setImgV(imgV+1)} class="next" >&#10095;</a>
                    :
                    ''
                }
                </span>
                :
                ''
            }
            {
                vid_item
            }
            </div>
            <div className="likes"><img  onClick={() => likePost(props.id)}  src={ props.like_flag === true ? like : unlike} alt="like" style={{height:'30px', width:'30px', display:'inline', margin:'auto',cursor:'pointer'}}/>
            {props.likes}
            <img  onClick={() => getComment(props.id)}  src={cmnt} alt="like" style={{height:'30px', width:'30px', display:'inline', margin:'auto',cursor:'pointer'}}/>
            {props.comm}
            </div>
            {
                showComment && 
                <div className="commentSection">
                <Comments tweetId={props.id} Users={users} Comments={null || comments}/>
                </div>
            }
        </div>
    );
}



const mapStateToProps = (state) => ({
    Loading : state.tweetReducer.isLoading,
    Likelist : state.likeReducer.data,
    Comments : state.commentReducer.data,
    update : state.commentReducer.done,
})

const mapDispatchToProps = (dispatch) => {
    return {
      deleteTweet: (payload) => dispatch(deleteTweet(payload)),
      updateTweet: (payload) => dispatch(updateTweet(payload)),
      likeTweet: (payload) => dispatch(likeTweet(payload)),
      fetchLikeList: (payload) => dispatch(fetchLikeList(payload)),
      readComment: (payload) => dispatch(readComment(payload)),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Tweet);