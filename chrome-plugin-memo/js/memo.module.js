function memoModule(db){
    let tNotes = new Store('T_notes', db);
    let gNotes = new Store('G_notes', db);
    /* ============== memo add start ===================== */
    $('#memo-modal-form').form({
        fields: {
            'memo-title': [{
                regex: /\S/,
                text: '不能为空'
            }]
            ,'memo-time': [{
                regex: /|\s|(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})/,
                text: '输入的日期格式不正确'
            }]
            // ,'memo-content': [{
            //     regex: /\S/,
            //     text: '不能为空'
            // }]
        },
        success: function(forms){
            let that = this;
            let data = {
                title: undefined,
                time: undefined,
                content: undefined
            };

            Object.keys(data).forEach(function(key){
                this[key] = forms['memo-' + key].value;
            }, data);

            console.log('success', data);
        }
    });
    /* ============== memo add end ===================== */
}
