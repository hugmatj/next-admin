import data from '../data/data.json'
export default function () {
  return (<div>
    <h1>{data.Title}</h1>
    <p>{data.Desc}</p>

    <hr />

    <h1>Features</h1>
    <div style={{ border: 'solid black 1px', padding: 10 }}>
      <div style={{ border: 'solid black 1px', padding: 20 }}>{data.Features[0]}</div>
      <div style={{ border: 'solid black 1px', padding: 20 }}>{data.Features[1]}</div>
      <div style={{ border: 'solid black 1px', padding: 20 }}>{data.Features[2]}</div>
    </div>


    <hr />

    <h1>Blog</h1>
    <div>{data.Posts.map(post => <div style={{ border: 'solid black 1px', margin: 20 }}>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>)}</div>
  </div>)
}