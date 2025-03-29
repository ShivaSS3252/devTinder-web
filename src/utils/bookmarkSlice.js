import { createSlice } from "@reduxjs/toolkit";

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: {
    bookmarkedProfiles: [], // Active bookmarks
    previouslyBookmarkedProfiles: [], // Unbookmarked profiles
  },
  reducers: {
    addbookmark: (state, action) => {
      state.bookmarkedProfiles = action.payload;
    },
    removeBookmark: (state, action) => {
      state.bookmarkedProfiles = state.bookmarkedProfiles.filter(
        (bookmark) => bookmark._id !== action.payload
      );
    },
    addPreviousBookmark: (state, action) => {
      state.previouslyBookmarkedProfiles = action.payload; // Store previously bookmarked profiles
    },
  },
});

export const { addbookmark, removeBookmark, addPreviousBookmark } =
  bookmarkSlice.actions;
export default bookmarkSlice.reducer;
