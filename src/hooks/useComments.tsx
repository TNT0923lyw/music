import { useCallback, useEffect, useState } from "react"

// 从后端借口拿到返回的评论数据！！！
import { getAlbumComment } from '../service/api/album'
import { getPlaylistComment, getSongComment } from '../service/api/music'
import { getMVVideoComment, getVideoComment } from '../service/api/video'

import { CommentType } from '../type/type'


export const useComment = (
    id: string | number,
    type: 'Song' | 'PlayList' | 'Album' | 'MV' | 'Video'
) => {
    const [comments, setComments] = useState<CommentType[]>([])
    const [hotComments, setHotComments] = useState<CommentType[]>([])
    const [curPage, setCurPage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    // 使用 useCallback() 减少子组件没有必要的 reRender
    const fetchData = useCallback(() => {
        ; (async () => {
            let res: any = {}
            switch (type) {
                case 'Song':
                    res = await getSongComment(id, curPage)
                    break
                case 'PlayList':
                    res = await getPlaylistComment(id, curPage)
                    break
                case 'Album':
                    res = await getAlbumComment(id, curPage)
                    break
                case 'MV':
                    res = await getMVVideoComment(id, curPage)
                    break
                case 'Video':
                    res = await getVideoComment(id, curPage)
                    break
            }
            if (res.hotComments) {
                setHotComments(res.hotComments)
            }
            setComments(res.comments)
            setTotal(res.total)
        })()   // 匿名函数自调用！！！
    }, [curPage, id])
    useEffect(() => {
        fetchData()
    }, [fetchData])
    useEffect(() => {
        setCurPage(1)
    }, [id])
    return { comments, hotComments, curPage, setCurPage, total, loading, setLoading, fetchData }
}