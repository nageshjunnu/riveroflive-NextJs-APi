"use client"
import React, { useState, useRef,useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './Music.module.css'
import axios from 'axios';
import { BASE_URL, APIKEY } from "~/utils/apiConfig";


const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
// console.log("APIKEY ",APIKEY)
  const songs = [
    {
      title: 'Song 1',
      file: '/music/song1.mp3',
    },
    {
      title: 'Song 2',
      file: '/music/song2.mp3',
    },
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [languages, setLanguages] = useState({})
  const [fileSets, setFileSets] = useState("")
  const [dataByid, setDataById] = useState("")
  const [audioFiles, setAudioFiles] = useState({})
  const [languageId, setLanguageId] = useState("6696")
  const [bookId, setBookId] = useState("MAT")
  const [fileSetId, setFileSetId] = useState("TELDPIN1DA")
  const [audioFileType, setAudioFileType] = useState("audio")
  const [chapterId, setChapterId] = useState(1)
  const [status, setStatus] = useState({
    isPlaying: false
  });

  const toggleAudio = () =>
  status.isLoaded
    ? status.isPlaying
      ? audioRef.current.pause()
      : audioRef.current.play()
    : console.log("Audio has not loaded yet.");

  const playPauseToggle = () => {
    console.log("is play", isPlaying)
    if (isPlaying) {
      // audioRef.current.pause();
      setStatus({ ...status, isPlaying: false })
    } else {
      // audioRef.current.play();
      setStatus({ ...status, isPlaying: true })
    }
   
  };

  const handleNextSong = () => {
    // const nextIndex = (currentSongIndex + 1) % songs.length;
    // setCurrentSongIndex(nextIndex);
    // setIsPlaying(true);
    if(chapterId >= 1){
      setChapterId(chapterId+1)
      fetchFileSet(languageId)
      fetchLanguages()
      fetchDataById(fileSetId,audioFileType)
      fetchAudioFiles(chapterId,bookId,fileSetId,audioFileType)
    }
  };

  const handlePrevSong = () => {
    // const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    // setCurrentSongIndex(prevIndex);
    // setIsPlaying(true);
  
      setChapterId(chapterId-1)
      fetchFileSet(languageId)
      fetchLanguages()
      fetchDataById(fileSetId,audioFileType)
      fetchAudioFiles(chapterId,bookId,fileSetId,audioFileType)
    
  };

  const fetchFileSet = (lng) => {
    axios
      .get(`${BASE_URL}bibles?key=${APIKEY}&language_code=${lng}&v=4`)
      .then((res) => {
        // console.log("res",res?.data);
        setFileSets(res);
      })
      .catch((err) => console.log(err, "err"));
  };

  const fetchLanguages = () => {
    axios
      .get(`${BASE_URL}languages?key=${APIKEY}&v=4&page=3`)
      .then((res) => {
        // console.log("lnguage ",res?.data);
        setLanguages(res?.data);
      })
      .catch((err) => console.log(err, "err"));
  };

  const fetchDataById = (fileset_id, type) => {
    axios
      .get(`${BASE_URL}bibles/filesets/${fileset_id}/books?v=4&key=${APIKEY}&fileset_type=${type}`)
      .then((res) => {
        // console.log("data by id ",res?.data);
        setDataById(res?.data);
      })
      .catch((err) => console.log(err, "err"));
  };

  const fetchAudioFiles = (id,book_id,fileset_id,type) => {
    axios
      .get(`${BASE_URL}bibles/filesets/${fileset_id}?key=${APIKEY}&v=4&book_id=${book_id}&chapter_id=${id}&type=${type}`)
      .then((res) => {
        // console.log("data by id ",res?.data);
        setAudioFiles(res);
      })
      .catch((err) => console.log(err, "err"));
  };

  useEffect(() => {
    fetchFileSet(languageId)
    fetchLanguages()
    fetchDataById(fileSetId,audioFileType)
    fetchAudioFiles(chapterId,bookId,fileSetId,audioFileType)
  }, []);

  const handleCLidkId = (id,book_id) =>{
    // console.log(id)
    fetchAudioFiles(id,book_id,fileSetId,audioFileType)
    setBookId(book_id)
    setChapterId(id)
  } 

  const handleCLickFile = (data) =>{
      // console.log(data)
      fetchDataById(data?.id, data?.type)
      setFileSetId(data?.id)
      setAudioFileType(data?.type)
  }

  const handleCLickLng = (data) => {
      // console.log("lng id", data)
      setLanguageId(data)
      fetchFileSet(data)
  }

  return (
    <div>
      {/* <h2>Music Player</h2> */}
      {/* <audio ref={audioRef} src={songs[currentSongIndex].file}></audio> */}
      {/* <AudioPlayer
        autoPlay="false"
        controls
        volume
        loop
        src={songs[currentSongIndex].file}
        onPlay={e => console.log(e)}
        ref={audioRef}
        // other props here
      /> */}
      <div>
       
      </div>
      {/* <p>Now Playing: {songs[currentSongIndex].title}</p> */}
      {/* {console.log("file sets ", fileSets?.data)} */}
      <section className="bg-primary-50 dark:bg-slate-800" id="faqsFour">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {audioFiles?.data?.data?.map((item)=>{
                return (
                  <>
                  {/* {console.log("name", item)} */}
                  {item?.book_name +"--Book :"+ item?.book_id}
                  <br/>chapter : {item?.chapter_start}
                  {/* <img src = {item?.thumbnail} width={"100px"} height={"100px"}/> */}
                  <AudioPlayer
                  autoPlay
                  controls
                  volume
                  loop
                  src={item?.path}
                  onPause={e => console.log(e)}
                  onPlay={() => setStatus({ ...status, isPlaying: true })}
                  ref={audioRef}
                  // other props here
                />
                  <br/>
                  </>
                )
              })}
            <div
  class="inline-flex rounded-md shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
  role="group">
               <button onClick={handlePrevSong}
                type="button"
                class="inline-block rounded-l bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700"
                data-te-ripple-init
                data-te-ripple-color="light"
               
               >Previous <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-8 w-8">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg></button>
              {/* <button 
                type="button"
                class="inline-block rounded-l bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700"
                data-te-ripple-init
                data-te-ripple-color="light"
              
              onClick={toggleAudio}>
                 {isPlaying ? ' Pause' : ' Play'}
              </button> */}
              <button
              type="button"
              class="inline-block rounded-l bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white "
              data-te-ripple-init
              data-te-ripple-color="light"              
              onClick={handleNextSong}>Next  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-8 w-8">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg></button>

       </div>
              

      <div className="flex items-stretch justify-center">
          <div className="grid w-full md:grid-cols-3 md:items-center md:gap-4">
            <div className="block h-full sm:flex sm:items-center sm:justify-between md:mx-4 md:mt-10 md:block md:px-4">
                <div className="flex h-fit w-full justify-center sm:justify-start">
                   <button onClick={ ()=>handleCLickLng(6414)}> English</button> <br/>
                </div>
                <div className="flex h-fit w-full justify-center sm:justify-start">
                  <button onClick={ ()=>handleCLickLng(2355)}> Hindi</button> <br/>
                </div>
                <div className="flex h-fit w-full justify-center sm:justify-start">
                  <button onClick={ ()=>handleCLickLng(6696)}> Telugu</button> <br/>
                </div>
                <div className="flex h-fit w-full justify-center sm:justify-start">
                  <button onClick={ ()=>handleCLickLng(4100)}> Marathi</button> <br/>
                </div>
                <div className="flex h-fit w-full justify-center sm:justify-start">
                  <button onClick={ ()=>handleCLickLng(2326)}> Hebrew</button> <br/>
                </div>
                <div className="flex h-fit w-full justify-center sm:justify-start">
                  <button onClick={ ()=>handleCLickLng(6411)}> Spanish</button> <br/>
                </div>
            </div>
            <div className="block h-full sm:items-center  md:block">
                {fileSets?.data?.data?.map((lng)=>{
                  return (
                    <>
                    {lng?.name}
                    {/* {console.log("dd", lng?.filesets["dbp-prod"])} */}
                    {lng?.filesets["dbp-prod"]?.map((item, index) => 
                          <>
                          <span key={index}>
                            
                            {item?.codec == "mp3"?(
                            <button 
                            type="button"
                            class="inline-block rounded bg-primary px-4 pb-[5px] pt-[6px] text-xs font-medium "
                            onClick={ ()=>handleCLickFile(item)}>{"("+item?.type + ")"}</button>
                            ):""}
                          
                          </span>
                        </>
                        )}
                    <br/>
                    </>
                  )
                })}
            </div>  
                      
          </div>
         
        </div>
        <div className="mt-4 h-fit md:col-span-2 md:mx-4 md:mt-0 md:px-4">
              {dataByid?.data?.map((lng)=>{
                    return (
                      <>
                      Book : {lng?.book_id}
                      <br/>
                      {/* {console.log("chapters ", lng)} */}
                      <p>
                      chapters : {lng?.chapters.length}
                      <br/>
                      {lng?.name}
                      <br/>
                      <table class="min-w-full text-left text-sm font-light">
                       <tbody>
                        <tr class="border-b dark:border-neutral-500">
                      {lng?.chapters?.map((item, index) => 
                          <span key={index}>

                   
                            <td class="whitespace-nowrap px-6 py-4 font-medium"><button   onClick={ ()=>handleCLidkId(item,lng?.book_id)}>{item + " | "}</button></td>
                          
                          
                          
                          </span>
                        )}
                        </tr>
                       </tbody>
                      </table>
                      </p>
                      <br/>
                      <table class="min-w-full text-left text-sm font-light">
                       <tbody>
                        <tr class="border-b dark:border-neutral-500">
                            <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                          </tr>
                       </tbody>
                      </table>
                      </>
                    )
                  })}
            </div>  
      </div>
    </section>

    
    </div>
  );
};

export default MusicPlayer;
