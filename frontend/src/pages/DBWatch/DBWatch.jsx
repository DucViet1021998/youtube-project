import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import dayjs from "dayjs";

import { Col, Row, theme, Avatar, Tooltip } from 'antd';
import { v4 as id } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import request from "~/utils/request";

import MiniVideo from "~/components/MiniVideos";
import { Store } from "~/store/store";

import classNames from 'classnames/bind';
import styles from './DBWatch.module.scss';
const cx = classNames.bind(styles);


function DBWatch() {
    const store = useContext(Store)
    const [video, setVideo] = useState([])
    const [miniVideo, setMiniVideo] = useState([])
    const routeParams = useParams();

    const userId = store.user[0]._id;

    const {
        token: { colorBgDescriptions },
    } = theme.useToken();

    useEffect(() => {

        async function getSongs() {
            try {
                const response = await request.get(`dashboard/watch/${routeParams.songId}`)
                setVideo(response.data)
            } catch (error) {
                console.log("error Data!");
            }
        }
        getSongs()
    }, [routeParams.songId])

    useEffect(() => {

        async function getSongs() {
            try {
                const response = await request.get('user-songs', {
                    headers: { userId: userId }
                })
                setMiniVideo(response.data)
            } catch (error) {
                console.log("error Data!");
            }
        }
        getSongs()
        document.title = video.title;
    }, [video.title, userId, routeParams.songId])



    return (
        <>
            <Row gutter={[24, 16]}>
                <Col className={cx("container-left")}
                    lg={18} sm={24} xs={24} >

                    {/* Main Video */}
                    <ReactPlayer
                        className={cx("video")}
                        width={"100%"}
                        controls url={video.video_url} />
                    {/* END OF Main Video */}

                    {/* Title Video and Channel Youtube */}
                    <h2 className={cx("title")}>{video.title}</h2>
                    <a href={video.channel_url}>
                        <div className={cx("channel")}>
                            <Avatar className={cx("avatar")} src={video.channel_avatar} />
                            <h4 className={cx("name-channel")}><Tooltip color={'#616161'} title={video.channel} placement="top">{video.channel}</Tooltip></h4>
                            {video.verified && <span className={cx("check")}>
                                <Tooltip color={'#616161'} placement="top" title='Verified'>
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </Tooltip>
                            </span>}


                            <span className={cx("subscriber")}><Tooltip color={'#616161'} title={video.subscriber_count} placement="top">{video.subscriber_count_text} subscribers</Tooltip></span>
                        </div>
                    </a>
                    {/* END OF Title Video and Channel Youtube */}
                    <Row>
                        <div
                            style={{
                                backgroundColor: colorBgDescriptions
                            }}
                            className={cx("container-descriptions")}
                        >
                            <h3 className={cx("tittle-descriptions")}>{video.view_count} views Premiered on {dayjs(video.publish_date).format('D MMMM, YYYY')}</h3>
                            <p className={cx("description")}>{video.description}</p>
                        </div>
                    </Row>

                </Col>

                <Col
                    style={{
                        // overflow: 'auto',
                        minHeight: '100vh',
                    }}
                    lg={6} sm={0} xs={0}>
                    {miniVideo.map((vid) => (
                        <Row key={id()}>
                            <MiniVideo key={id()} data={vid} />
                        </Row>

                    ))}

                </Col>
            </Row>
        </>
    )


}

export default DBWatch;