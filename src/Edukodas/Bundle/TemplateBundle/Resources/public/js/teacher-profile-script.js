$(document).ready(function() {
    // Point History
    // Add points modal
    $('#add-points-modal').modal({
            ready: function() {
                addPointHistoryButton();
            },
            complete: function() {
                $('#add-points-form-container').html('');
                $('.task-list-container').addClass('hide');
            }
        }
    );

    // Edit points modal
    $('#edit-points-modal').modal({
            ready: function(modal, trigger) {
                editPointHistoryButton(trigger);
            },
            complete: function() {
                $('#edit-points-modal > .modal-content > .form-content').html('');
            }
        }
    );

    // Select task in add points modal
    $('.points-task-select-button').click(function (e) {
        e.preventDefault();

        var taskId = $(this).data('taskId');
        var amount = parseInt($(this).data('taskAmount'));
        var taskName = $('.points-task-select-button*[data-task-id="' + taskId + '"]').text();
        var taskDescription = $('.points-task-description*[data-task-id="' + taskId + '"]').text();

        $('#add-points-task-name').html(taskName);
        $('#add-points-task-description').html(taskDescription);
        $('#edukodas_bundle_statisticsbundle_pointhistory_task').val(taskId);
        $('#edukodas_bundle_statisticsbundle_pointhistory_amount').val(amount);
        $('#edukodas_bundle_statisticsbundle_pointhistory_comment').characterCounter();

        toggleAddPointsForm();
    });

    // Initialize delete points button
    $('.delete-points').on('click', deletePointsButton);

    // Forms

    // Add points form
    function addPointsForm() {
        var isStudentProfile = $('#points-history-list').data('is-student-profile');

        if (isStudentProfile) {
            var user_id = $('#edukodas_points_add').data('user-id');
            $('#edukodas_bundle_statisticsbundle_pointhistory_student').val(user_id);
            $('#student-select').addClass('hide');
        }

        studentSelectize();

        var url = Routing.generate('edukodas_points_add');

        $('#add-points-form').ajaxForm({
            url: url,
            type: 'POST',
            data: {
                isStudentProfile: isStudentProfile
            },
            beforeSubmit: function() {
                if ($('#edukodas_bundle_statisticsbundle_pointhistory_student').val() == '') {
                    return false;
                }
                $('#add-points-submit').prop('disabled', true).hide();
                $('#points-submit-preloader').removeClass('hide');
            },
            success: function(data) {
                $('#points-history-list').prepend(data);
                $('.delete-points:first').on('click', deletePointsButton);
                $('#add-points-modal').modal('close');
                $('#add-points-submit').prop('disabled', false).show();
                $('#points-submit-preloader').addClass('hide');
                toggleAddPointsForm();
                $('#edukodas_bundle_statisticsbundle_pointhistory_comment').val('');
            },
            error: function(data) {
                $('#points-submit-preloader').addClass('hide');
                if(data['status'] == 400) {
                    $('#add-points-form-container').html(data['responseText']);
                    $('#add-points-form-back').click(function (e) {
                        e.preventDefault();
                        toggleAddPointsForm();
                    });
                    addPointsForm();
                } else {
                    Materialize.toast('Klaida išsaugant taškus', 4000);
                    $('#add-points-submit').prop('disabled', false).show();
                }
            }
        });
    }

    // Edit points form
    function editPointHistoryForm (url, pointHistoryId) {
        var isStudentProfile = $('#points-history-list').data('is-student-profile');

        if (isStudentProfile) {
            var user_id = $('#edukodas_points_add').data('user-id');
            $('#edukodas_bundle_statisticsbundle_pointhistory_student').val(user_id);
        }

        $('select#edukodas_bundle_statisticsbundle_pointhistory_task').material_select();
        $('#edukodas_bundle_statisticsbundle_pointhistory_comment').characterCounter();

        studentSelectize();

        $('#edit-points-form').ajaxForm({
            url: url,
            type: 'POST',
            data: {
                isStudentProfile: isStudentProfile
            },
            beforeSubmit: function() {
                if ($('#edukodas_bundle_statisticsbundle_pointhistory_student').val() == '') {
                    return false;
                }
                $('#edit-points-save').prop('disabled', true).hide();
                $('#points-save-preloader').removeClass('hide');
            },
            success: function(data) {
                if (data) {
                    $('#history-points-' + pointHistoryId).replaceWith(data);
                    $('#history-points-' + pointHistoryId + ' .delete-points').on('click', deletePointsButton);
                    $('#edit-points-modal').modal('close');
                    $('#points-save-preloader').addClass('hide');
                }
            },
            error: function(data) {
                $('#points-save-preloader').addClass('hide');
                if (data['status'] == 400) {
                    $('#edit-points-modal > .modal-content > .form-content').html(data['responseText']);
                    editPointHistoryForm(url);
                } else {
                    Materialize.toast('Klaida išsaugant taškus', 4000);
                    $('#edit-points-save').prop('disabled', false).show();
                }
            }
        });
    }

    // Buttons

    // Add point history button
    function addPointHistoryButton(trigger) {
        var url = Routing.generate('edukodas_points_add');

        $.ajax({
            url:   url,
            type: 'GET',
            beforeSend: function() {
                $('#add-points-form-container').html('');
                $('.task-list-container').addClass('hide');
                $('#points-form-preloader').removeClass('hide');
            },
            success: function(data) {
                if (data) {
                    $('#points-form-preloader').addClass('hide');
                    $('.task-list-container').removeClass('hide');
                    $('#add-points-form-container').html(data);
                    $('#add-points-form-back').click(function (e) {
                        e.preventDefault();
                        toggleAddPointsForm();
                    });
                    addPointsForm();
                }
            },
            error: function() {
                Materialize.toast('Nepavyko užkrauti formos', 4000);
                $('#add-points-modal').modal('close');
                $('#add-points-form-preloader').addClass('hide');
            }
        });
    }

    // Edit point history button
    function editPointHistoryButton(trigger) {
        var pointHistoryId = trigger.data('points-id');
        var url = Routing.generate('edukodas_points_edit', {id : pointHistoryId});

        $.ajax({
            url:   url,
            type: 'GET',
            beforeSend: function() {
                $('#edit-points-modal > .modal-content > .form-content').html('');
                $('#edit-points-form-preloader').removeClass('hide');
            },
            success: function(data) {
                if (data) {
                    $('#edit-points-form-preloader').addClass('hide');
                    $('#edit-points-modal > .modal-content > .form-content').html(data);
                    editPointHistoryForm(url, pointHistoryId);
                }
            },
            error: function() {
                Materialize.toast('Nepavyko užkrauti formos', 4000);
                $('#edit-points-modal').modal('close');
                $('#edit-points-form-preloader').addClass('hide');
            }
        });
    }

    // Delete points button
    function deletePointsButton() {
        var pointHistoryId = $(this).data('points-id');
        var url = Routing.generate('edukodas_points_delete', {id : pointHistoryId});

        $.ajax({
            url: url,
            type: 'DELETE',
            beforeSend: function() {
                $('.delete-points*[data-points-id="' + pointHistoryId + '"]').prop('disabled',true).hide();
                $('#delete-points-preload-' + pointHistoryId).removeClass('hide');
            },
            success: function() {
                $('#history-points-' + pointHistoryId).remove();
            },
            error: function(data) {
                Materialize.toast('Nepavyko ištrinti taškų', 4000);
                $('#delete-points-preload-' + pointHistoryId).addClass('hide');
                $('.delete-points*[data-points-id="' + pointHistoryId + '"]').prop('disabled',false).show();
            }
        });
    }

    // Functions

    // Toggle between task list and add points form in add points modal
    function toggleAddPointsForm() {
        if ($('.task-list-container').hasClass('hide')) {
            $('.task-list-container').removeClass('hide');
            $('#add-points-form-container').addClass('hide');
        } else {
            $('.task-list-container').addClass('hide');
            $('#add-points-form-container').removeClass('hide');
        }
    }

    // Add selectize to student select field
    function studentSelectize() {
        var currentSelectizeValue;

        $('#edukodas_bundle_statisticsbundle_pointhistory_student').selectize({
            plugins: {
                'no_results': { message: 'Nepavyko nieko rasti' }
            },
            onChange: function (value) {
                if (!value.length || value == currentSelectizeValue) {
                    return;
                }
            },
            onBlur: function () {
                if (this.getValue() === '') {
                    this.setValue(currentSelectizeValue);
                }
            },
            onFocus: function () {
                currentSelectizeValue = this.getValue();
                this.clear(true);
            }
        });
    }

// Tasks

    function manageTaskButton(trigger) {
        var taskAction = trigger.data('task-action');
        var taskId = trigger.data('task-id');
        var url = Routing.generate(taskAction, {id : taskId});

        $.ajax({
            url:   url,
            type: 'GET',
            beforeSend: function() {
                $('#manage-task-modal > .modal-content > .form-content').html('');
                $('#task-form-preloader').removeClass('hide');
            },
            success: function(data) {
                if (data) {
                    $('#task-form-preloader').addClass('hide');
                    $('#manage-task-modal > .modal-content > .form-content').html(data);
                    manageTaskForm(url);
                }
            },
            error: function() {
                Materialize.toast('Nepavyko užkrauti formos', 4000);
                $('#manage-task-modal').modal('close');
                $('#task-form-preloader').addClass('hide');
            }
        });
    }

    function deleteTaskButton() {
        var taskId = $(this).data('task-id');
        var url = Routing.generate('edukodas_tasks_delete', {id : taskId});

        $.ajax({
            url: url,
            type: 'DELETE',
            beforeSend: function() {
                $('.delete-task*[data-task-id="' + taskId + '"]').prop('disabled',true).hide();
                $('#delete-task-preload-' + taskId).removeClass('hide');
            },
            success: function(data) {
                if (data) {
                    updateTasksList(data);
                }
            },
            error: function() {
                Materialize.toast('Nepavyko ištrinti užduoties', 4000);
                $('#delete-task-preload-' + taskId).addClass('hide');
                $('.delete-task*[data-task-id="' + taskId + '"]').prop('disabled',false).show();
            }
        });
    }

    function manageTaskForm(url) {
        $('select').material_select();
        $('#edukodas_bundle_tasksbundle_task_description').characterCounter();

        $('#manage-task-form').ajaxForm({
            url: url,
            type: 'POST',
            beforeSubmit: function() {
                $('#manage-task-form button').prop('disabled', true).hide();
                $('#submit-preloader').removeClass('hide');
            },
            success: function(data) {
                updateTasksList(data);
                $('#manage-task-modal').modal('close');
                $('#submit-preloader').addClass('hide');
            },
            error: function(data) {
                $('#submit-preloader').addClass('hide');
                if (data['status'] == 400) {
                    $('#manage-task-modal > .modal-content > .form-content').html(data['responseText']);
                    manageTaskForm(url);
                } else {
                    Materialize.toast('Klaida išsaugant užduotį', 4000);
                    $('#manage-task-form > button').prop('disabled', false).show();
                }
            }
        });
    }

    function updateTasksList(data) {
        $('#tasks-list').html(data);
        $('.delete-task').on('click', deleteTaskButton);
        $('.collapsible').collapsible();
    }

    $('#manage-task-modal').modal({
            ready: function(modal, trigger) {
                manageTaskButton(trigger);
            },
            complete: function() { $('#manage-task-modal > .modal-content > .form-content').html(''); }
        }
    );

    $('.delete-task').on('click', deleteTaskButton);
});
