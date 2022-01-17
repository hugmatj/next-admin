import Head from 'next/head'
import styles from '../styles/Admin.module.css'
import { default as __data } from '../data/data.json';
import { useEffect, useState } from 'react';
import sch from '../data/schemas.json'
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';


const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

const indexObj = (obj, ind) => {
  return obj[Object.keys(obj)[ind]]
}

function Tab(props) {
  return (
    <div className={styles.tab + (props.selected === props.num ? " " + styles.tabSelected : "")} num={props.id}>
      <div onClick={() => props.setTab(props.num)}>
        {props.text}
      </div>
    </div>
  );
}


function Tabs(props) {
  return (
    <div className={styles.tabs}>
      <div className={styles.tabGutter}>
        {Object.keys(props.data).map((x, i) => <Tab key={i} num={i} text={x} setTab={props.setTab} selected={props.tab} />)}
      </div>
    </div>
  );
}

function DBrow(props) {
  let ks = Object.keys(props.json);
  let vs = Object.values(props.json);
  const deleteSchema = () => {
    Swal.fire({
      text: "Are you sure you would like to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(200, 0, 75)",
      confirmButtonText: "Yes, Delete it",
      cancelButtonText: "Cancel",
      focusCancel: true,
      preConfirm: () => {
        fetch("/api/deleteSchema", {
          method: "POST",
          body: JSON.stringify({
            id: props.json.id,
            schema: props.schema
          }),
          headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
          }
        }).then(r => r.json())
          .then(res => {
            if (res.success) {
              props.updateData(res.data);
              Toast.fire({
                icon: "success",
                title: "Deleted"
              })
            } else {
              if(res.status){
                Swal.fire({
                  title: "Unauthorized",
                  text: "For security reasons, you automatically get logged out of the admin dashboard.  Please refresh the page and enter the password again to continue.",
                  icon: "error"
                })
              }
              else{
              Toast.fire({
                icon: "error",
                title: "Internal Error"
              })
              console.log(res.error);
            }
            }
          })
      }
    })
  }
  const viewSchema = () => {
    Swal.fire({
      html: `${ks.map((x, i) => `<div class='${styles.modalStat}'><div class='${styles.modalField}'>${x}</div> - <div class='${styles.modalValue}'>${vs[i]}</div></div>`).join(`<hr class='${styles.modalBreak}'/>`)}`
    })
  }
  return (<div className={styles.dbrow}>
    <div className={styles.dbleft}>{vs[0]}</div>
    <div className={styles.dbright}>
      <button type="button" onClick={deleteSchema} className={styles.delbtn}>Delete</button>
      <button type="button" onClick={viewSchema} className={styles.viewbtn}>View</button>
    </div>
  </div>)
}

function EditForm(props) {
  let [content, setContent] = useState(props.content);
  let [schCont, setSchCont] = useState(() => {
    if (Array.isArray(content)) {
      if (Object.keys(sch).includes(props.field)) {
        let sck = Object.keys(sch[props.field])
        let v = {}
        for (var i in sck) {
          v[sck[i]] = ""
        }
        return v
      }
    }
  })
  if (Array.isArray(content)) {
    if (Object.keys(sch).includes(props.field)) {
      let sck = Object.keys(sch[props.field])
      let scv = Object.values(sch[props.field])
      return (
        <form onSubmit={(e) => {
          props.submitSchema(e, sck.length, props.field);
          let vl = schCont;
          for (var i in sck) {
            vl[sck[i]] = "";
          }
          setSchCont(vl);
        }} className={props.tab === props.field ? styles.blockForm : styles.hide}>
          <h2>Add a new {props.field[props.field.length - 1].match(/s/i) ? props.field.slice(0, props.field.length - 1) : props.field}</h2>
          {sck.map((x, i) => <div key={i} className={styles.formControl}>
            <div className={styles.formLabel}>{sck[i]}</div>
            {scv[i] === "textarea" ? <textarea required name={sck[i]} rows={6} placeholder="text" value={schCont[sck[i]]} onChange={(e) => {
              let value = { ...schCont };
              value[sck[i]] = e.target.value;
              setSchCont(value)
            }} /> : <input required name={sck[i]} placeholder={scv[i]} type={scv[i]} rows={6} value={schCont[sck[i]]} onChange={(e) => {
              let value = { ...schCont };
              value[sck[i]] = e.target.value;
              setSchCont(value)
            }} />}
          </div>)}
          <input type="hidden" value={uuidv4()} name="id" />
          <button className={styles.submit}>Add</button>

          <h2>{props.field[props.field.length - 1].match(/s/i) ? props.field : props.field + "s"}</h2>
          {props.content.map((x, i) => <DBrow updateData={props.updateData} schema={props.field} key={i} json={props.content[i]} />)}
        </form>
      );
    }
    return (
      <form onSubmit={e => props.submit(e, content.length, props.field)} className={props.tab === props.field ? styles.blockForm : styles.hide}>
        <div className={styles.formLabel}>{props.field}</div>
        {content.map((x, i) => <div key={i} className={styles.formControl}>
          <textarea required name={`["${props.field}"][${i}]`} rows={6} placeholder="text" value={content[i]} onChange={(e) => {
            let value = [...content];
            value[i] = e.target.value;
            setContent(value)
          }} />
        </div>)}
        <button className={styles.submit}>Update</button>
      </form>
    );
  }
  return (
    <form onSubmit={e => props.submit(e, 1, props.field)} className={props.tab === props.field ? styles.blockForm : styles.hide}>
      <div className={styles.formLabel}>{props.field}</div>
      <div className={styles.formControl}>
        <textarea required name={`["${props.field}"]`} rows={6} placeholder="text" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <button className={styles.submit}>Update</button>
    </form>
  );
}

export default function Admin() {
  const [tab, setTab] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, updateData] = useState(__data);
  const [psw, spsw] = useState("");
  const submit = (e, num, field) => {
    e.preventDefault();
    let formBody = {}
    for (var i = 0; i < num; i++) {
      formBody[e.target[i].name] = e.target[i].value;
    }
    fetch("/api/updateContent", {
      method: "POST",
      body: JSON.stringify({
        data: formBody,
        field
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          updateData(res.data)
          Toast.fire({
            icon: "success",
            title: "Updated"
          })
        } else {
          if(res.status){
            Swal.fire({
              title: "Unauthorized",
              text: "For security reasons, you automatically get logged out of the admin dashboard.  Please refresh the page and enter the password again to continue.",
              icon: "error"
            })
          }
          else{
          Toast.fire({
            icon: "error",
            title: "Internal Error"
          })
          console.log(res.error);
        }
        }
      })
  }
  const submitSchema = (e, num, sch) => {
    e.preventDefault();
    let formBody = {}
    for (var i = 0; i <= num; i++) {
      formBody[e.target[i].name] = e.target[i].value;
    }
    fetch("/api/addSchema", {
      method: "POST",
      body: JSON.stringify({
        data: formBody,
        schema: sch
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          updateData(res.data)
          Toast.fire({
            icon: "success",
            title: "Added"
          })
        } else {
          if(res.status){
            Swal.fire({
              title: "Unauthorized",
              text: "For security reasons, you automatically get logged out of the admin dashboard.  Please refresh the page and enter the password again to continue.",
              icon: "error"
            })
          }
          else{
          Toast.fire({
            icon: "error",
            title: "Internal Error"
          })
          console.log(res.error);
        }
        }
      })
  }
  useEffect(() => {
    const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
    if (cookie("admin_session")) {
      setLoggedIn(true);
    }
  }, [])
  return (<div>
    <Head>
      <title>Admin</title>
    </Head>
    {loggedIn && <div className={styles.bodyCont}>
      <Tabs data={data} setTab={(t) => setTab(t)} tab={tab} />
      {Object.keys(data).map((x, i) => {
        return <EditForm data={data} tab={Object.keys(data)[tab]} key={i} field={Object.keys(data)[i]} submit={submit} content={Object.values(data)[i]} submitSchema={submitSchema} updateData={updateData} />;
      })}
    </div>}
    {!loggedIn && <div className={styles.bodyCont}>
      <form method="POST" action="/api/authenticate" className={styles.loginForm} onSubmit={(e) => {
        e.preventDefault();
        fetch("/api/authenticate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "*/*",
          },
          body: JSON.stringify({
            password: psw
          })
        }).then(r => r.json()).then(res => {
          if(res.success){
            location.reload();
          }else{
            Swal.fire({
              icon: "error",
              text: res.message
            })
          }
        })
      }}>
        <h2>Log In</h2>
        <div className={styles.formControl}>
          <input value={psw} onChange={(e) => spsw(e.target.value)} type="password" placeholder="Password" name="password"/>
        </div>
        <button className={styles.submit}>Submit</button>
      </form>
    </div>}
  </div>);
}
