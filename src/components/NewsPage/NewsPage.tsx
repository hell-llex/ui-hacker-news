import { useParams } from '@vkontakte/vk-mini-apps-router';
import { Group, CardGrid, Card, Link, Title, Headline, Cell, Counter, Accordion, Div, PanelSpinner, Separator, Spacing, SimpleCell } from '@vkontakte/vkui';
import { Icon24AddOutline, Icon24MinusOutline, Icon28MessageOutline } from '@vkontakte/icons';
import { useEffect, useState } from 'react';
import { News, IComment } from '../../types';
import { useAppSelector } from '../../hooks/redux';

function decodeHtmlEntitiesWithLinks(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  function replaceLinks(text: string) {
    return text.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/g, '(ссылка: "$1")');
  }
  const textarea = document.createElement('textarea');
  textarea.innerHTML = doc.body.innerHTML;
  const decodedText = textarea.value.replace(/<[^>]*>/g, '');
  const textWithLinksReplaced = replaceLinks(decodedText);
  return textWithLinksReplaced;
}

const Comment = ({ comment }: { comment: IComment }) => {

  return (
    <>
      <Div>
        <SimpleCell
          multiline
          expandable="auto"
          subtitle={`${new Date(comment.time * 1000).toLocaleString()} / By: ${comment.by}`}
        >
          {decodeHtmlEntitiesWithLinks(comment.text)}
        </SimpleCell>
        <Separator />
      </Div>
      {comment.children && comment.children.map((childComment) => (
        <Div key={childComment.id}>
          <Comment comment={childComment} />
        </Div>
      ))}
    </>
  );
};

const CommentTree = ({ comments }: { comments: Promise<void | IComment[]> }) => {
  const [commentsData, setCommentsData] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const resolvedComments = await comments as IComment[];
        setCommentsData(resolvedComments);
        setIsLoading(false);
      } catch (error) {
        console.error(`Error fetching comment: ${error}`);
        setIsLoading(false);
      }
    };

    if (comments instanceof Promise) {
      fetchComments();
    } else {
      setCommentsData(comments);
      setIsLoading(false);
    }
  }, [comments]);

  if (isLoading) {
    return <PanelSpinner>Панель загружается, пожалуйста, подождите...</PanelSpinner>;
  }

  return (
    <div>
      {(commentsData && commentsData.length > 0) &&
        commentsData.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))
      }
    </div>
  );
};

const NewsPage = () => {
  const abortController = new AbortController();
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingParents, setIsLoadingParents] = useState(false)
  const params = useParams<'id'>();
  const [item, setItem] = useState<News>()
  const [parentsComments, setParentsComments] = useState<IComment[]>();
  const [openParentsComment, setOpenParentsComment] = useState<{ [index: number]: boolean }>({});

  const baseUrlApi = useAppSelector((state) => state.hackerNews.baseUrlApi);

  async function processComments(commentIds: number[], commentsMap: Record<number, IComment>): Promise<IComment[]> {
    const comments: IComment[] = [];

    for (const commentId of commentIds) {
      const comment = await fetchComment(commentId);
      if (comment) {
        commentsMap[commentId] = comment;
        if (comment.kids && comment.kids.length > 0) {
          const children = await processComments(comment.kids, commentsMap);
          comment.children = children;
        }
        comments.push(comment);
      }
    }
    return comments;
  }

  async function fetchComment(commentId: number): Promise<IComment | null> {
    try {
      const response = await fetch(`${baseUrlApi}item/${commentId}.json`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching comment ${commentId}: ${error}`);
      return null;
    }
  }

  async function UpdateComments(arrayIdComments: number[], parent: boolean): Promise<void | IComment[]> {
    if (parent) {
      const arrayComments: IComment[] = [];
      arrayIdComments.forEach(async (commentId: number, i) => {
        const comment = await fetchComment(commentId);
        if (comment) {
          arrayComments.push(comment);
        }
        if (i === arrayIdComments.length - 1) {
          setParentsComments(arrayComments);
          setIsLoadingParents(false);
        };
      });
    } else {
      const commentsMap: Record<number, IComment> = {};
      const comments = await processComments(arrayIdComments, commentsMap);
      return comments
    }
  }

  const UpdateNews = (auto: boolean, controller: AbortController) => {
    if (!auto) {
      setIsLoading(true);
    }

    params && fetch(`${baseUrlApi}item/${params.id}.json`, { signal: controller.signal })
      .then(response => response.json())
      .then(story => {
        setItem(story);
        story.kids && UpdateComments(story.kids, true);
      })
      .catch(error => {
        console.error('Error fetching story:', error);
      })
      .finally(() => {
      });
  }

  useEffect(() => {
    UpdateNews(false, abortController);
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      {(isLoading && !item) ? <PanelSpinner size="large" /> : <Group mode="plain">
        <Div>
          <CardGrid size="l">
            <Card>
              <Div>
                <Title level="1" style={{ marginBottom: 16 }}>
                  {item?.title}
                </Title>
                <Headline level="2">
                  <Link href={item?.url} target="_blank" hasVisited>Ссылка, на статью</Link>
                </Headline>
                <Spacing size={10}>
                  <Separator />
                </Spacing>
                <Headline level="2">
                  By: {item?.by} / {item && new Date(item.time * 1000).toLocaleString()}
                </Headline>
              </Div>
              <Div>
                <Group>
                  <Div>
                    <Cell
                      disabled={item?.descendants === 0}
                      onClick={() => (UpdateNews(false, abortController), setParentsComments([]), setIsLoadingParents(true))}
                      before={<Icon28MessageOutline />}
                      indicator={
                        <Counter>{item && item.descendants}</Counter>
                      }
                      subtitle={item?.descendants !== 0 && "нажмите чтобы обновить"}
                    >
                      Комментарии
                    </Cell>
                  </Div>
                  <Div>
                    {item?.descendants === 0 ? <>Комментарии отсутствуют</> : <>{(!isLoadingParents && parentsComments) ? (parentsComments.map((elem, i) =>
                    (<div key={elem.id}>
                      {i !== 0 && <Separator />}
                      {!elem.kids ?
                        <SimpleCell
                          multiline
                          expandable="auto"
                          subtitle={`${new Date(elem.time * 1000).toLocaleString()} / By: ${elem.by}`}
                        >
                          {decodeHtmlEntitiesWithLinks(elem.text)}
                        </SimpleCell> : <><Accordion
                          onChange={(e) => (elem && elem.kids && elem.id) && (setOpenParentsComment(prevState => ({ ...prevState, [elem.id]: e })))}
                          disabled={!elem.kids}
                        >
                          <Accordion.Summary ExpandIcon={Icon24AddOutline} CollapseIcon={Icon24MinusOutline} subtitle={`${new Date(elem.time * 1000).toLocaleString()} / By: ${elem.by}`}>
                            {decodeHtmlEntitiesWithLinks(elem.text)}
                          </Accordion.Summary>
                          <Accordion.Content>
                            <Separator />
                            {
                              <Div>
                                {(openParentsComment[elem.id] && elem.kids?.length! > 0) ? <CommentTree comments={UpdateComments(elem.kids!, false)} /> : <PanelSpinner>Комментарии загружаются, пожалуйста, подождите...</PanelSpinner>}
                              </Div>
                            }
                          </Accordion.Content>
                        </Accordion>
                        </>
                      }
                    </div>
                    )
                    )) : <PanelSpinner>Комментарии загружается, пожалуйста, подождите...</PanelSpinner>}
                    </>}
                  </Div>
                </Group>
              </Div>
            </Card>
          </CardGrid >
        </Div >
      </Group >}
    </>
  );
};

export default NewsPage;
