import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import NoteCard from "../../components/NoteCard";
import AddEditNotes from "./AddEditNotes";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import ToastModal from "../../components/ToastModal";
import EmptyCard from "../../components/EmptyCard";
import NoNotesImg from "../../assets/no-data.svg";
import NoSearchResult from "../../assets/no-search-result.svg";

function Home() {
	const [openAddEditModal, setOpenAddEditModal] = useState({
		isShown: false,
		type: "add",
		date: null,
	});
	const [showToastModal, setShowToastModal] = useState({
		isShown: false,
		message: "",
		type: "add",
	});
	const [userInfo, setUserInfo] = useState(null);
	const [allNotes, setAllNotes] = useState([]);
	const [isSearch, setIsSearch] = useState(false);

	const navigate = useNavigate();

	const handleEdit = (noteDetails) => {
		setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
	};

	const showToastMessage = (message, type) => {
		setShowToastModal({
			isShown: true,
			message,
			type,
		});
	};

	const handleCloseToast = () => {
		setShowToastModal({ isShown: false, message: "" });
	};

	//Get User Info
	const getUserInfo = useCallback(async () => {
		try {
			const response = await axiosInstance.get("/user/get-user");
			if (response.data?.user) {
				setUserInfo(response.data.user);
			}
		} catch (error) {
			console.log("An unexpected error occurred. Please try again.");
			localStorage.clear();
			navigate("/login");
		}
	}, [navigate]);

	//Get all notes
	const getAllNotes = useCallback(async () => {
		try {
			const response = await axiosInstance.get("/note/get-notes");
			if (response.data?.notes) {
				setAllNotes(response.data.notes);
			}
		} catch (error) {
			console.log("An unexpected error occurred. Please try again.");
		}
	}, []);
    
	//Delete note
	const deleteNote = async (note) => {
		try {
			const response = await axiosInstance.delete(
				`/note/delete-note/${note._id}`
			);

			if (!response.data?.error) {
				showToastMessage("Note Deleted Successfully", "delete");
				getAllNotes();
			}
		} catch (error) {
			if (error.response?.data?.message) {
				console.log("An unexpected error occurred. Please try again.");
			}
		}
	};

	//Search notes
	const onSearchNote = async (query) => {
        try {
			const response = await axiosInstance.get("/note/search-notes", {
				params: { query },
			});
            
			if(response.data?.notes){
				setIsSearch(true);
				setAllNotes(response.data.notes);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const updateIsPinned = async (note) => {
        try {
			const response = await axiosInstance.put(`/note/update-note-pin/${note._id}`, {
				isPinned: !note.isPinned,
			});
            
			if(response.data?.note){
				showToastMessage("Note Updated Successfully");
				getAllNotes();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleClearSearch = () => {
        setIsSearch(false);
		getAllNotes();
	};

	useEffect(() => {
		getAllNotes();
		getUserInfo();
		return () => {};
	}, [getAllNotes, getUserInfo]);

	return (
		<>
			<Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>

			<div className="container mx-auto">
				{allNotes.length > 0 ? (
					<div className="grid grid-cols-3 gap-4 mt-8">
						{allNotes.map((note, index) => {
							return (
								<NoteCard
									key={index}
									title={note.title}
									date={note.createdAt}
									content={note.content}
									tags={note.tags}
									isPinned={note.isPinned}
									onEdit={() => handleEdit(note)}
									onDelete={() => deleteNote(note)}
									onPinNote={() => updateIsPinned(note)}
								/>
							);
						})}
					</div>
				) : (
					<EmptyCard
						imgSrc={isSearch ? NoSearchResult : NoNotesImg}
						message={isSearch ? "Oops! No notes found matching your search" : `Start creating your first note! Click the "Add" button to jot down your thoughts, ideas and reminders. Let's get started!`}
					/>
				)}
			</div>

			<button
				className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
				onClick={() => {
					setOpenAddEditModal({ isShown: true, type: "add", date: null });
				}}
			>
				<MdAdd className="text-[32px] text-white" />
			</button>

			<Modal
				isOpen={openAddEditModal.isShown}
				onRequestClose={() => {}}
				style={{
					overlay: {
						backgroundColor: "rgba(0,0,0,0.2)",
					},
				}}
				contentLabel=""
				className="w-[40%] max-h-[85%] bg-white rounded-md mx-auto mt-14 p-5 overflow-y-auto outline-none"
			>
				<AddEditNotes
					type={openAddEditModal.type}
					noteData={openAddEditModal.data}
					onClose={() => {
						setOpenAddEditModal({ isShown: false, type: "add", data: null });
					}}
					getAllNotes={getAllNotes}
					showToastMessage={showToastMessage}
				/>
			</Modal>

			<ToastModal
				isShown={showToastModal.isShown}
				message={showToastModal.message}
				type={showToastModal.type}
				onClose={handleCloseToast}
			/>
		</>
	);
}

export default Home;
