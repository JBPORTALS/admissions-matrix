import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RootState } from ".";

export const fetchSelectedMatrix = createAsyncThunk<
  SelectedMatrix[],
  {
    admissionno: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/admission/fetchSelectedMatrix",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    var data;
    try {
      const formData = new FormData();
      formData.append("admissionno", payload.admissionno);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "searchstudent.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchSearchClass = createAsyncThunk<
  SelectedMatrix[],
  {
    college: string;
    branch: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/admission/fetchSearchClass",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    var data;
    try {
      const formData = new FormData();
      formData.append("college", payload.college);
      formData.append("branch", payload.branch);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "searchclass.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchOverallMatrix = createAsyncThunk<
  OverallMatrix[],
  void,
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/admissions/fetchoverallmatrix",
  async (_payload, { fulfillWithValue, rejectWithValue }) => {
    var data;
    try {
      const response = await axios({
        url:
          process.env.NEXT_PUBLIC_ADMISSIONS_URL + "retrieveoverallmatrix.php",
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchBranchList = createAsyncThunk<
  { msg: string },
  {
    college: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/admissions/fetchbranchlist",
  async (payload, { fulfillWithValue, rejectWithValue, getState }) => {
    var data;
    try {
      const formData = new FormData();
      formData.append("college", payload.college);
      const response = await axios({
        url:
          process.env.NEXT_PUBLIC_ADMISSIONS_URL + "retrievebrancheslist.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const fetchUnApprovedAdmissions = createAsyncThunk<
  { msg: string },
  {
    college: string;
    branch: string;
  },
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/admissions/fetchUnApprovedAdmissions",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    var data;
    try {
      const formData = new FormData();
      formData.append("college", payload.college);
      formData.append("branch", payload.branch);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "retrievenotapproved.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const updateMatrix = createAsyncThunk<
  { msg: string },
  void,
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/admissions/updateAdmissionDetail",
  async (
    payload,
    { fulfillWithValue, rejectWithValue, getState, dispatch }
  ) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const selected_Matrix = state.admissions.selectedMatrix
        .data as SelectedMatrix[];
      formData.append("admissionno", selected_Matrix[0]?.admission_id);
      formData.append("name", selected_Matrix[0].name);
      formData.append("college", selected_Matrix[0].college);
      formData.append("branch", selected_Matrix[0].branch);
      formData.append("fname", selected_Matrix[0].father_name);
      formData.append("phone", selected_Matrix[0].phone_no);
      formData.append("email", selected_Matrix[0].email);
      formData.append("fee_fixed", selected_Matrix[0].fee_fixed);
      formData.append("fee_paid", selected_Matrix[0].fee_paid);
      formData.append("paid_date", selected_Matrix[0].paid_date);
      formData.append("remaining", selected_Matrix[0].remaining_amount);
      formData.append("due_date", selected_Matrix[0].due_date);
      formData.append("approved_by", selected_Matrix[0].approved_by);
      formData.append("remarks", selected_Matrix[0].remarks);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "updatestudent.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const updateEnquiry = createAsyncThunk<
  { msg: string },
  void,
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/admissions/updateEnquery",
  async (
    payload,
    { fulfillWithValue, rejectWithValue, getState, dispatch }
  ) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const selected_Matrix = state.admissions.selectedMatrix
        .data as SelectedMatrix[];
      formData.append("admissionno", selected_Matrix[0]?.admission_id);
      formData.append("name", selected_Matrix[0].name);
      formData.append("college", selected_Matrix[0].college);
      formData.append("branch", selected_Matrix[0].branch);
      formData.append("fname", selected_Matrix[0].father_name);
      formData.append("phone", selected_Matrix[0].phone_no);
      formData.append("email", selected_Matrix[0].email);
      formData.append("fee_quoted", selected_Matrix[0].fee_quoted);
      formData.append("quoted_by", selected_Matrix[0].quoted_by);
      formData.append("fee_fixed", selected_Matrix[0].fee_fixed);
      formData.append("fee_fixed", selected_Matrix[0].fee_fixed);
      formData.append("fee_paid", selected_Matrix[0].fee_paid);
      formData.append("paid_date", selected_Matrix[0].paid_date);
      formData.append("remaining", selected_Matrix[0].remaining_amount);
      formData.append("due_date", selected_Matrix[0].due_date);
      formData.append("approved_by", selected_Matrix[0].approved_by);
      formData.append("remarks", selected_Matrix[0].remarks);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "updateenquiry.php",
        method: "POST",
        data: formData,
      });
      dispatch(
        fetchUnApprovedAdmissions({
          college: selected_Matrix[0].college,
          branch: selected_Matrix[0].branch,
        })
      );
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const addAdmission = createAsyncThunk<
  { msg: string },
  AddStudent,
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/admissions/addAdmission",
  async (
    payload,
    { fulfillWithValue, rejectWithValue, getState, dispatch }
  ) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const username = "Bot";
      formData.append("name", payload.name);
      formData.append("college", payload.college);
      formData.append("branch", payload.branch);
      formData.append("fname", payload.father_name);
      formData.append("phone", payload.phone_no);
      formData.append("email", payload.email);
      formData.append("fee_fixed", payload.fee_fixed);
      formData.append("fee_paid", payload.fee_paid);
      formData.append("paid_date", payload.paid_date);
      formData.append("remaining", payload.remaining_amount);
      formData.append("due_date", payload.due_date);
      formData.append("approved_by", username);
      formData.append("remarks", payload.remarks);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "addstudent.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export const updateToApprove = createAsyncThunk<
  { msg: string },
  void,
  {
    rejectValue: {
      msg: string;
    };
  }
>(
  "/admissions/updateToApprove",
  async (
    payload,
    { fulfillWithValue, rejectWithValue, getState, dispatch }
  ) => {
    var data;
    try {
      const formData = new FormData();
      const state = getState() as RootState;
      const selected_data = state.admissions.selectedMatrix
        .data[0] as SelectedMatrix;
      const name = "Bot";
      formData.append("name", selected_data.name);
      formData.append("admissionno", selected_data.admission_id);
      formData.append("college", selected_data.college);
      formData.append("branch", selected_data.branch);
      formData.append("fname", selected_data.father_name);
      formData.append("phone", selected_data.phone_no);
      formData.append("email", selected_data.email);
      formData.append("fee_fixed", selected_data.fee_fixed);
      formData.append("fee_paid", selected_data.fee_paid);
      formData.append("due_date", selected_data.due_date);
      formData.append("approved_by", name);
      formData.append("referred_by", selected_data.referred_by);
      formData.append("remarks", selected_data.remarks);
      formData.append("status", "APPROVED");
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "approveenquiry.php",
        method: "POST",
        data: formData,
      });
      data = response.data;
      dispatch(
        fetchUnApprovedAdmissions({
          college: selected_data.college,
          branch: selected_data.branch,
        })
      );
      return fulfillWithValue(data);
    } catch (error: any) {
      return rejectWithValue({ msg: error.response.data.msg });
    }
  }
);

export interface BranchAdmission {
  admission_id: string;
  name: string;
  college: string;
  branch: string;
  father_name: string;
  phone_no: string;
  email: string;
  fee_fixed: string;
  fee_paid: string;
  paid_date: string;
  remaining_amount: string;
  due_date: string;
  approved_by: string;
}

export interface AddStudent
  extends Omit<BranchAdmission, "admission_id" | "approved_by"> {
  remarks: string;
}

export interface SelectedMatrix extends BranchAdmission {
  remarks: string;
  referred_by: string;
  total: string;
  fee_quoted: string;
  quoted_by: string;
}

export interface OverallMatrix {
  college: string;
  total: string;
  allotted_seats: string;
  remaining_seats: string;
  filled_percentage: string;
}

export interface BranchMatrix {
  branch: string;
  total: string;
  allotted_seats: string;
  remaining_seats: string;
  filled_percentage: string;
}

interface FeesIntialState {
  branch_admissions: {
    data: [];
    pending: boolean;
    error: null | string;
  };
  overall_matrix: {
    data: [];
    pending: boolean;
    error: null | string;
  };
  branchlist: {
    data: [];
    pending: boolean;
    error: null | string;
  };
  selectedMatrix: {
    data: any[];
    pending: boolean;
    error: null | string;
  };
  branch_matrix: {
    data: [];
    pending: boolean;
    error: null | string;
  };
  search_class: {
    data: [];
    pending: boolean;
    error: null | string;
  };
  add_admission: {
    pending: boolean;
    error: null | string;
  };
  update_approve: {
    pending: boolean;
    error: null | string;
  };
  unapproved_matrix: {
    data: [];
    pending: boolean;
    error: null | string;
  };
}

const initialState: FeesIntialState = {
  branch_admissions: {
    data: [],
    error: null,
    pending: false,
  },
  branchlist: {
    data: [],
    error: null,
    pending: false,
  },
  overall_matrix: {
    data: [],
    error: null,
    pending: false,
  },
  selectedMatrix: {
    data: [],
    error: null,
    pending: false,
  },
  branch_matrix: {
    data: [],
    error: null,
    pending: false,
  },
  search_class: {
    data: [],
    error: null,
    pending: false,
  },
  update_approve: {
    pending: false,
    error: null,
  },
  add_admission: {
    pending: false,
    error: null,
  },
  unapproved_matrix: {
    data: [],
    pending: false,
    error: null,
  },
};

export const AdmissionsSlice = createSlice({
  name: "admissions",
  initialState,
  reducers: {
    updateSelectedMatrix(state, action) {
      state.selectedMatrix.data = state.selectedMatrix.data.map(
        (value: any) => ({ ...value, ...action.payload })
      );
    },
  },
  extraReducers: {
    [fetchOverallMatrix.pending.toString()]: (state, action) => {
      state.overall_matrix.pending = true;
    },
    [fetchOverallMatrix.fulfilled.toString()]: (state, action) => {
      state.overall_matrix.pending = false;
      state.overall_matrix.data = action.payload;
    },
    [fetchOverallMatrix.rejected.toString()]: (state, action) => {
      state.overall_matrix.pending = false;
      state.overall_matrix.error = action.payload?.msg;
      toast.error(action.payload?.msg, { position: "top-right" });
    },
    [fetchUnApprovedAdmissions.pending.toString()]: (state, action) => {
      state.unapproved_matrix.pending = true;
      state.unapproved_matrix.error = null;
    },
    [fetchUnApprovedAdmissions.fulfilled.toString()]: (state, action) => {
      state.unapproved_matrix.pending = false;
      state.unapproved_matrix.data = action.payload;
      state.unapproved_matrix.error = null;
    },
    [fetchUnApprovedAdmissions.rejected.toString()]: (state, action) => {
      state.unapproved_matrix.pending = false;
      state.unapproved_matrix.data = [];
      state.unapproved_matrix.error = action.payload?.msg;
    },
    [fetchSearchClass.pending.toString()]: (state, action) => {
      state.search_class.pending = true;
      state.search_class.error = null;
    },
    [fetchSearchClass.fulfilled.toString()]: (state, action) => {
      state.search_class.pending = false;
      state.search_class.data = action.payload;
      state.search_class.error = null;
    },
    [fetchSearchClass.rejected.toString()]: (state, action) => {
      state.search_class.pending = false;
      state.search_class.data = [];
      state.search_class.error = action.payload?.msg;
    },
    [fetchSelectedMatrix.pending.toString()]: (state, action) => {
      state.selectedMatrix.pending = true;
    },
    [fetchSelectedMatrix.fulfilled.toString()]: (state, action) => {
      state.selectedMatrix.pending = false;
      state.selectedMatrix.data = action.payload;
    },
    [fetchSelectedMatrix.rejected.toString()]: (state, action) => {
      state.selectedMatrix.pending = false;
      state.selectedMatrix.error = action.payload?.msg;
      toast.error(action.payload?.msg, { position: "top-right" });
    },
    [fetchBranchList.pending.toString()]: (state, action) => {
      state.branchlist.pending = true;
    },
    [fetchBranchList.fulfilled.toString()]: (state, action) => {
      state.branchlist.pending = false;
      state.branchlist.data = action.payload;
    },
    [fetchBranchList.rejected.toString()]: (state, action) => {
      state.branch_admissions.data = [];
    },
    [updateMatrix.pending.toString()]: (state, action) => {
      state.selectedMatrix.pending = true;
    },
    [updateMatrix.fulfilled.toString()]: (state, action) => {
      toast.success(action.payload?.msg, { position: "top-right" });
      state.selectedMatrix.pending = false;
    },
    [updateMatrix.rejected.toString()]: (state, action) => {
      toast.error(action.payload?.msg, { position: "top-right" });
      state.selectedMatrix.pending = false;
    },
    [updateEnquiry.pending.toString()]: (state, action) => {
      state.selectedMatrix.pending = true;
    },
    [updateEnquiry.fulfilled.toString()]: (state, action) => {
      toast.success(action.payload?.msg, { position: "top-right" });
      state.selectedMatrix.pending = false;
    },
    [updateEnquiry.rejected.toString()]: (state, action) => {
      toast.error(action.payload?.msg, { position: "top-right" });
      state.selectedMatrix.pending = false;
    },
    [addAdmission.pending.toString()]: (state, action) => {
      state.add_admission.pending = true;
    },
    [addAdmission.fulfilled.toString()]: (state, action) => {
      state.add_admission.pending = false;
      state.add_admission.error = null;
      toast.success(action.payload?.msg, { position: "top-right" });
    },
    [addAdmission.rejected.toString()]: (state, action) => {
      state.add_admission.error = action.payload?.msg;
      state.add_admission.pending = false;
      toast.error(action.payload?.msg, { position: "top-right" });
    },
    [updateToApprove.pending.toString()]: (state, action) => {
      state.update_approve.pending = true;
    },
    [updateToApprove.fulfilled.toString()]: (state, action) => {
      state.update_approve.pending = false;
      state.update_approve.error = null;
      toast.success(action.payload?.msg, { position: "top-right" });
    },
    [updateToApprove.rejected.toString()]: (state, action) => {
      state.update_approve.error = action.payload?.msg;
      state.update_approve.pending = false;
      toast.error(action.payload?.msg, { position: "top-right" });
    },
  },
});

export const { updateSelectedMatrix } = AdmissionsSlice.actions;
