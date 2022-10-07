const useRequest = function () {
	// NOTE: 請根據後端API位置調整
	const BASE_URL = 'https://localhost:5001/api'
	const FILE_UPLOAD_URL = '/Token/FileUpload'

	const request = axios.create({ baseURL: BASE_URL })

	const beforeRequest = (config) => {
		// 發 request 前處理

		// 如果有 JWT Token 就帶
		const token = Cookies.get('token')
		token && (config.headers['Authorization'] = `Bearer ${token}`)

		return config
	}

	// 請求攔截器
	request.interceptors.request.use(beforeRequest)

	const responseSuccess = (response) => {
		// 2XX
		// NOTE: 請根據後端API接口做調整

		// console.log(response)
		return response.data
	}

	const responseFail = (err) => {
		// !2XX

		// console.log(err)
		const { response } = err
		const { statusText, status } = response

		// NOTE: 統一處理失敗行為
		switch (status) {
			case 401:
				toastr.warning('未登入')
				// TODO: handle 401 ex. redirect
				break

			case 403:
				toastr.warning('未授權')
				// TODO: handle 403
				break

			case 404:
				// TODO: handle 404
				break
		}

		return Promise.reject(response)
	}

	// 回應攔截器
	request.interceptors.response.use(responseSuccess, responseFail)

	// TODO: 自定義檔案上傳
	const httpFileUpload = (file) => {
		const formData = new FormData()
		formData.append('file', file)

		return request.post(FILE_UPLOAD_URL, formData)
	}

	return {
		httpGet: request.get,
		httpPost: request.post,
		httpPut: request.put,
		httpDelete: request.delete,
		httpFileUpload
	}
}
