<div class="klara-timeline-img klara-picture">
  <img src="/sites/all/themes/klaraontheroad/images/klara-icon-location.svg" alt="Location">
</div> <!-- klara-timeline-img -->
<div class="klara-timeline-content">
  <div class="group-left">
    <?php print $fields['field_broadcast_pic']->content; ?>
  </div>
  <div class="group-right">
    <h2><?php print $fields['title']->content; ?></h2>
    <p><?php print $fields['body']->content; ?></p>
    <span class="klara-date"><?php print $fields['field_broadcast_date']->content; ?></span>
  </div>
</div> <!-- klara-timeline-content -->
